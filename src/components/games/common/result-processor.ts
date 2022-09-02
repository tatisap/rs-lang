import WordsAPI from '../../../api/words-api';
import { GameName, IGameCorrectAnswer, IGameQuestionResult, IUserWord } from '../../../types';
import DateFormatter from '../../../utils/date-formatter';
import RequestProcessor from '../../request-processor';
import UserWord from '../../user-word';

export default class GameResultProcessor {
  private api: WordsAPI;

  private requestProcessor: RequestProcessor;

  private dateFormatter: DateFormatter;

  constructor() {
    this.api = new WordsAPI();
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
  }

  private async processCorrectAnswer(
    word: IGameCorrectAnswer,
    dateKey: string,
    gameName: GameName
  ): Promise<void> {
    try {
      const userWordInfo: IUserWord = await this.requestProcessor.process<IUserWord>(
        this.api.getUserWord,
        { wordId: word.wordId }
      );

      const userWord: UserWord = new UserWord().update(userWordInfo);

      userWord.increaseCorrectAnswersInRow();

      if (!userWord.getLearningStatus() && userWord.checkCorrectAnswersInRow()) {
        userWord.markAsLearned(dateKey);
      }

      if (userWord.isUsed()) {
        userWord.setFirstUseInfo(gameName, dateKey);
      }

      userWord.increaseCorrectAnswers(gameName, dateKey);

      await this.requestProcessor.process(this.api.updateUserWord, {
        wordId: word.wordId,
        body: userWord.getUserWordInfo(),
      });
    } catch {
      const userWord: UserWord = new UserWord();

      userWord.increaseCorrectAnswersInRow();
      userWord.setFirstUseInfo(gameName, dateKey);
      userWord.increaseCorrectAnswers(gameName, dateKey);

      await this.requestProcessor.process(this.api.createUserWord, {
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
        this.api.getUserWord,
        {
          wordId: word.wordId,
        }
      );
      const userWord: UserWord = new UserWord().update(userWordInfo);
      userWord.resetCorrectAnswersInRow();
      if (userWord.getLearningStatus()) {
        userWord.remoreLearnedMark();
      }
      if (userWord.isUsed()) {
        userWord.setFirstUseInfo(gameName, dateKey);
      }
      userWord.increaseIncorrectAnswers(gameName, dateKey);

      await this.requestProcessor.process(this.api.updateUserWord, {
        wordId: word.wordId,
        body: userWord.getUserWordInfo(),
      });
    } catch {
      const userWord = new UserWord();
      userWord.setFirstUseInfo(gameName, dateKey);
      userWord.increaseIncorrectAnswers(gameName, dateKey);

      await this.requestProcessor.process(this.api.createUserWord, {
        wordId: word.wordId,
        body: userWord.getUserWordInfo(),
      });
    }
  }
}
