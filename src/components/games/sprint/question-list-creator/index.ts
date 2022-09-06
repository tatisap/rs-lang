import WordsAPI from '../../../../api/words-api';
import {
  BOOK_SECTIONS,
  BASE_URL,
  STORAGE_KEYS,
  DEFAULT_PAGE_NAME,
  MAX_PAGES_IN_BOOK_SECTION,
} from '../../../../constants';
import { IAggregatedWord, ISprintQuestionInfo, IWord, Numbers, PageName } from '../../../../types';
import Randomizer from '../../../../utils/randomizer';
import RequestProcessor from '../../../request-processor';
import AuthController from '../../../auth/auth-controller';

export default class QuestionListCreator {
  private api: WordsAPI;

  private randomizer: Randomizer;

  private requestProcessor: RequestProcessor;

  private authController: AuthController;

  constructor() {
    this.api = new WordsAPI();
    this.randomizer = new Randomizer();
    this.requestProcessor = new RequestProcessor();
    this.authController = new AuthController();
  }

  public async getQuestionList(level: number, levelPage?: number): Promise<ISprintQuestionInfo[]> {
    const currentPage =
      (localStorage.getItem(STORAGE_KEYS.currentPage) as PageName) || DEFAULT_PAGE_NAME;
    const result: ISprintQuestionInfo[] = [];

    if (currentPage === 'studentBook') {
      if (level === BOOK_SECTIONS.difficultWords.group) {
        const wordList = this.randomizer.shuffle<IAggregatedWord>(
          await this.requestProcessor.process<IAggregatedWord[]>(this.api.getDifficultWords)
        );
        return this.randomizer.shuffle<ISprintQuestionInfo>(this.createMinQuestionInfo(wordList));
      }
      for (
        let iteration = levelPage as number;
        iteration >= Numbers.One;
        iteration -= Numbers.One
      ) {
        // eslint-disable-next-line no-await-in-loop
        await this.addPageQuestionListToArray(result, level, iteration, levelPage);
      }
      return result;
    }
    for (
      let iteration = Numbers.One;
      iteration <= MAX_PAGES_IN_BOOK_SECTION;
      iteration += Numbers.One
    ) {
      // eslint-disable-next-line no-await-in-loop
      await this.addPageQuestionListToArray(result, level, iteration);
    }
    return this.randomizer.shuffle<ISprintQuestionInfo>(result);
  }

  private async addPageQuestionListToArray(
    resultingArray: ISprintQuestionInfo[],
    section: number,
    iteration: number,
    page?: number
  ): Promise<void> {
    const wordList = this.randomizer.shuffle<IWord>(await this.api.getWords(section, iteration));
    let questionsInfo: ISprintQuestionInfo[];
    if (page) {
      questionsInfo = this.randomizer.shuffle<ISprintQuestionInfo>(
        this.createMinQuestionInfo(wordList)
      );
    } else {
      questionsInfo = this.createMinQuestionInfo(wordList);
    }
    if (this.authController.isUserAuthorized() && page) {
      questionsInfo = await this.excludeLearnedWords(questionsInfo, section);
    }
    questionsInfo.forEach((questionInfo: ISprintQuestionInfo): void => {
      resultingArray.push(questionInfo);
    });
  }

  private async excludeLearnedWords(
    questionCards: ISprintQuestionInfo[],
    section: number
  ): Promise<ISprintQuestionInfo[]> {
    const unlearnedWords: ISprintQuestionInfo[] = [];
    const learnedWords: IAggregatedWord[] = await this.requestProcessor.process(
      this.api.getDifficultAndLearnedWords,
      { group: section }
    );
    questionCards.forEach((questionCard: ISprintQuestionInfo): void => {
      if (
        !learnedWords.find(
          (learnedWord: IAggregatedWord) => learnedWord._id === questionCard.correctAnswer.wordId
        )
      ) {
        unlearnedWords.push(questionCard);
      }
    });
    return unlearnedWords;
  }

  private createMinQuestionInfo(
    wordsInfoArray: IWord[] | IAggregatedWord[]
  ): ISprintQuestionInfo[] {
    const answerOptions: string[] = this.randomizer.shuffle<string>(
      wordsInfoArray.map((wordInfo: IWord | IAggregatedWord): string => wordInfo.wordTranslate)
    );

    return wordsInfoArray.map((wordInfo: IWord | IAggregatedWord, index: number) => {
      return {
        correctAnswer: {
          wordId: (wordInfo as IWord).id || (wordInfo as IAggregatedWord)._id,
          audioUrl: `${BASE_URL}/${wordInfo.audio}`,
          imageUrl: `${BASE_URL}/${wordInfo.image}`,
          word: wordInfo.word,
          wordTranslation: wordInfo.wordTranslate,
        },
        answerOption: {
          wordTranslation: index % Numbers.Two ? answerOptions[index] : wordInfo.wordTranslate,
          isCorrect: index % Numbers.Two ? wordInfo.wordTranslate === answerOptions[index] : true,
        },
      };
    });
  }
}
