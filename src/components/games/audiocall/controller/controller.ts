import WordsAPI from '../../../../api/words-api';
import {
  AUDIOCALL_ANSWER_OPTIONS_NUMBER,
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
    levelPage = this.randomizer.getRandomIntegerFromOneToMax(MAX_PAGES_IN_BOOK_SECTION)
  ): Promise<IAudiocallQuestionInfo[]> {
    let wordList: IWord[] | IAggregatedWord[];
    if (level === BOOK_SECTIONS.difficultWords.group) {
      wordList = this.randomizer.shuffle<IAggregatedWord>(
        await this.requestProcessor.process<IAggregatedWord[]>(this.api.getDifficultWords)
      );
    } else {
      wordList = this.randomizer.shuffle<IWord>(await this.api.getWords(level, levelPage));
    }

    return wordList.map(
      (questionWordInfo: IWord | IAggregatedWord): IAudiocallQuestionInfo =>
        this.createQuestionInfo(questionWordInfo, wordList)
    );
  }

  private createQuestionInfo(
    questionWordInfo: IWord | IAggregatedWord,
    wordsInfoArray: IWord[] | IAggregatedWord[]
  ): IAudiocallQuestionInfo {
    const questionBookWordInfo: IWord = questionWordInfo as IWord;
    const questionDifficultWordInfo: IAggregatedWord = questionWordInfo as IAggregatedWord;
    const bookWordsInfoArray: IWord[] = wordsInfoArray as IWord[];
    const difficultWordsInfoArray: IAggregatedWord[] = wordsInfoArray as IAggregatedWord[];

    const wordsForAnswerOptions: IWord[] | IAggregatedWord[] = this.randomizer.shuffle(
      [
        questionBookWordInfo,
        ...this.randomizer.getRandomItemsFromArray(
          bookWordsInfoArray.filter(
            (wordInfo: IWord): boolean => questionBookWordInfo !== wordInfo
          ),
          AUDIOCALL_ANSWER_OPTIONS_NUMBER - Numbers.One
        ),
      ] || [
        questionDifficultWordInfo,
        ...this.randomizer.getRandomItemsFromArray(
          difficultWordsInfoArray.filter(
            (wordInfo: IAggregatedWord): boolean => questionDifficultWordInfo !== wordInfo
          ),
          AUDIOCALL_ANSWER_OPTIONS_NUMBER - Numbers.One
        ),
      ]
    );
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
}
