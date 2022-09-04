import WordsAPI from '../../../../api/words-api';
import {
  AUDIOCALL_ANSWER_OPTIONS_NUMBER,
  AUDIOCALL_QUESTIONS_NUMBER,
  BASE_URL,
  BOOK_SECTIONS,
  MAX_PAGES_IN_BOOK_SECTION,
} from '../../../../constants';
import {
  IAggregatedWord,
  IAudiocallAnswerOption,
  IAudiocallQuestionInfo,
  IWord,
  Numbers,
} from '../../../../types';
import Randomizer from '../../../../utils/randomizer';
import RequestProcessor from '../../../request-processor';

export default class AudiocallController {
  private api: WordsAPI;

  private randomizer: Randomizer;

  private requestProcessor: RequestProcessor;

  constructor() {
    this.api = new WordsAPI();
    this.randomizer = new Randomizer();
    this.requestProcessor = new RequestProcessor();
  }

  public async getQuestionList(
    level: number,
    levelPage?: number
  ): Promise<IAudiocallQuestionInfo[]> {
    let wordListForQuestions: IWord[] | IAggregatedWord[];
    let wordListForOptions: IWord[];

    if (level === BOOK_SECTIONS.difficultWords.group) {
      wordListForQuestions = this.randomizer.shuffle<IAggregatedWord>(
        await this.requestProcessor.process<IAggregatedWord[]>(this.api.getDifficultWords)
      );
      const randomDifficultWord: IAggregatedWord =
        wordListForQuestions[
          this.randomizer.getRandomIntegerFromOneToMax(wordListForQuestions.length) - Numbers.One
        ];
      wordListForOptions = await this.api.getWords(
        randomDifficultWord.group,
        randomDifficultWord.page
      );
    } else if (levelPage) {
      console.log(1.2);
      wordListForQuestions = await this.pickUnlearnedWords(level, levelPage);
      wordListForOptions = await this.api.getWords(level, levelPage);
    } else {
      const randomPage: number =
        this.randomizer.getRandomIntegerFromOneToMax(MAX_PAGES_IN_BOOK_SECTION);
      wordListForQuestions = this.randomizer.shuffle<IWord>(
        await this.api.getWords(level, randomPage)
      );
      wordListForOptions = wordListForQuestions;
    }

    return wordListForQuestions.map(
      (questionWordInfo: IWord | IAggregatedWord): IAudiocallQuestionInfo =>
        this.createQuestionInfo(questionWordInfo, wordListForOptions)
    );
  }

  private createQuestionInfo(
    questionWordInfo: IWord | IAggregatedWord,
    wordsForOptions: IWord[]
  ): IAudiocallQuestionInfo {
    const wordsForAnswerOptions: (IWord | IAggregatedWord)[] = this.randomizer.shuffle([
      questionWordInfo,
      ...this.randomizer.getRandomItemsFromArray(
        wordsForOptions.filter(
          (wordInfo: IWord): boolean =>
            ((questionWordInfo as IWord).id || (questionWordInfo as IAggregatedWord)._id) !==
            wordInfo.id
        ),
        AUDIOCALL_ANSWER_OPTIONS_NUMBER - Numbers.One
      ),
    ]);
    return {
      correctAnswer: {
        wordId: (questionWordInfo as IWord).id || (questionWordInfo as IAggregatedWord)._id,
        audioUrl: `${BASE_URL}/${questionWordInfo.audio}`,
        imageUrl: `${BASE_URL}/${questionWordInfo.image}`,
        word: questionWordInfo.word,
        wordTranslation: questionWordInfo.wordTranslate,
      },
      answerOptions: wordsForAnswerOptions.map(
        (wordInfo: IWord | IAggregatedWord): IAudiocallAnswerOption => {
          return {
            wordTranslation: wordInfo.wordTranslate,
            isCorrect: wordInfo.word === questionWordInfo.word,
          };
        }
      ),
    };
  }

  private async pickUnlearnedWords(level: number, levelPage: number): Promise<IWord[]> {
    const learnedWords: IAggregatedWord[] = await this.requestProcessor.process(
      this.api.getLearnedWords,
      { group: level }
    );

    const pickedWords: IWord[] = await this.loadWordsAbovePage(
      level,
      levelPage,
      AUDIOCALL_QUESTIONS_NUMBER,
      learnedWords
    );
    return pickedWords;
  }

  private async loadWordsAbovePage(
    level: number,
    page: number,
    numberOfWords: number,
    comparedWords: IAggregatedWord[]
  ): Promise<IWord[]> {
    const words: IWord[] = await this.api.getWords(level, page);
    console.log(comparedWords);
    const filteredWords: IWord[] = words.filter(
      (word: IWord): boolean =>
        !comparedWords.find(
          (comparedWord: IAggregatedWord): boolean => word.id === comparedWord._id
        )
    );
    console.log(filteredWords);
    if (page === Numbers.One) return filteredWords;
    if (filteredWords.length < numberOfWords) {
      filteredWords.push(
        ...(await this.loadWordsAbovePage(
          level,
          page - Numbers.One,
          numberOfWords - filteredWords.length,
          comparedWords
        ))
      );
    }
    return filteredWords;
  }
}
