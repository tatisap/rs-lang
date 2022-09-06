import WordsAPI from '../../../api/words-api';
import {
  GameName,
  IGameCorrectAnswer,
  IGameQuestionResult,
  IUserStatistics,
  IUserWord,
} from '../../../types';
import DateFormatter from '../../../utils/date-formatter';
import RequestProcessor from '../../request-processor';
import UserStatistics from '../../statistic/user-statistic';
import UserWord from '../../user-word';

export default class GameResultProcessor {
  private wordApi: WordsAPI;

  private userStatistics: UserStatistics;

  private requestProcessor: RequestProcessor;

  private dateFormatter: DateFormatter;

  constructor() {
    this.wordApi = new WordsAPI();
    this.userStatistics = new UserStatistics();
    this.requestProcessor = new RequestProcessor();
    this.dateFormatter = new DateFormatter();
  }

  public async processAnswer(gameName: GameName, answer: IGameQuestionResult): Promise<void> {
    const wordInfo: IGameCorrectAnswer = answer.correctAnswer;
    const todayDateKey: string = this.dateFormatter.getStringifiedDateKey(new Date());

    if (answer.isCorrect) {
      await this.processCorrectAnswer(wordInfo, todayDateKey, gameName);
    } else {
      await this.processIncorrectAnswer(wordInfo, todayDateKey, gameName);
    }
    await this.checkMaxCorrectAnswerSeries(gameName, todayDateKey, answer.isCorrect);
  }

  private async processCorrectAnswer(
    word: IGameCorrectAnswer,
    dateKey: string,
    gameName: GameName
  ): Promise<void> {
    try {
      const userWordInfo: IUserWord = await this.requestProcessor.process<IUserWord>(
        this.wordApi.getUserWord,
        { wordId: word.wordId }
      );

      const userWord: UserWord = new UserWord().update(userWordInfo);

      userWord.increaseCorrectAnswersInRow();

      if (!userWord.getLearningStatus() && userWord.checkCorrectAnswersInRow()) {
        userWord.markAsLearned(dateKey);
        userWord.markAsEasy();
      }

      if (!userWord.wasUsed()) {
        userWord.setFirstUseInfo(gameName, dateKey);
      }

      userWord.increaseCorrectAnswers(gameName, dateKey);

      await this.requestProcessor.process(this.wordApi.updateUserWord, {
        wordId: word.wordId,
        body: userWord.getUserWordInfo(),
      });
    } catch {
      const userWord: UserWord = new UserWord();

      userWord.increaseCorrectAnswersInRow();
      userWord.setFirstUseInfo(gameName, dateKey);
      userWord.increaseCorrectAnswers(gameName, dateKey);

      await this.requestProcessor.process(this.wordApi.createUserWord, {
        wordId: word.wordId,
        body: userWord.getUserWordInfo(),
      });
    }
  }

  private async processIncorrectAnswer(
    word: IGameCorrectAnswer,
    dateKey: string,
    gameName: GameName
  ): Promise<void> {
    try {
      const userWordInfo: IUserWord = await this.requestProcessor.process<IUserWord>(
        this.wordApi.getUserWord,
        {
          wordId: word.wordId,
        }
      );
      const userWord: UserWord = new UserWord().update(userWordInfo);
      userWord.resetCorrectAnswersInRow();
      if (userWord.getLearningStatus()) {
        userWord.removeLearnedMark();
      }
      if (!userWord.wasUsed()) {
        userWord.setFirstUseInfo(gameName, dateKey);
      }
      userWord.increaseIncorrectAnswers(gameName, dateKey);

      await this.requestProcessor.process(this.wordApi.updateUserWord, {
        wordId: word.wordId,
        body: userWord.getUserWordInfo(),
      });
    } catch {
      const userWord = new UserWord();
      userWord.setFirstUseInfo(gameName, dateKey);
      userWord.increaseIncorrectAnswers(gameName, dateKey);

      await this.requestProcessor.process(this.wordApi.createUserWord, {
        wordId: word.wordId,
        body: userWord.getUserWordInfo(),
      });
    }
  }

  public async checkMaxCorrectAnswerSeries(
    game: GameName,
    dateKey: string,
    isAnswerCorrect: boolean
  ): Promise<void> {
    const userStatisticsInfo: IUserStatistics = await this.userStatistics.load();
    this.userStatistics.update(userStatisticsInfo);

    if (isAnswerCorrect) {
      this.userStatistics.increaseCurrentCorrectAnswerSeries();
    } else {
      this.userStatistics.resetCurrentCorrectAnswerSeries();
    }

    this.userStatistics.updateMaxCorrectAnswerSeries(game, dateKey);
    await this.userStatistics.save();
  }

  public async prepareUserStatistic() {
    await this.userStatistics.init();
  }
}
