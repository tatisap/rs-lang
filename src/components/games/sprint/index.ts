import UIElementsConstructor from '../../../utils/ui-elements-creator';
import GameStartingPage from '../common/starting-page';
// eslint-disable-next-line import/no-cycle
import GameFinalPage from '../common/final-page';
import {
  IGameQuestionResult,
  GameName,
  Numbers,
  StringifiedBoolean,
  ISprintQuestionInfo,
} from '../../../types';
import { FIVE_SECONDS, GAMES, NO_CONTENT, ONE_SECOND } from '../../../constants';
import GameResultProcessor from '../common/result-processor';
import QuestionListCreator from './question-list-creator';
import AuthController from '../../auth/auth-controller';
import SprintMainView from './view/main-view';
import QuestionCardConstructor from './view/card-constructor';
import timerSound from '../../../assets/mp3/timer.mp3';

export default class SprintGame {
  private elementCreator: UIElementsConstructor;

  private startingPage: GameStartingPage;

  private finalPage: GameFinalPage;

  private gameResults: IGameQuestionResult[];

  private container: HTMLDivElement;

  private resultProcessor: GameResultProcessor;

  private questionListCreator: QuestionListCreator;

  private auth: AuthController;

  private mainView: SprintMainView;

  private questionCardConstructor: QuestionCardConstructor;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.startingPage = new GameStartingPage();
    this.finalPage = new GameFinalPage('sprint');
    this.gameResults = [];
    this.container = this.createGameContainer();
    this.resultProcessor = new GameResultProcessor();
    this.questionListCreator = new QuestionListCreator();
    this.auth = new AuthController();
    this.mainView = new SprintMainView();
    this.questionCardConstructor = new QuestionCardConstructor();
  }

  public async start(level?: number, levelPage?: number): Promise<void> {
    this.openGameContainer();
    if (this.auth.isUserAuthorized()) await this.resultProcessor.prepareUserStatistic();

    this.startingPage.open(GAMES.sprint.className as GameName, this.container, level, levelPage);

    this.container.addEventListener('level-selected', async (event: Event): Promise<void> => {
      this.clearGameContainer();
      this.clearGameResults();
      const selectedLevel: number = (event as CustomEvent).detail?.selectedLevel;
      const selectedPage: number = (event as CustomEvent).detail?.selectedPage;
      this.finalPage.updateCurrentLevel(selectedLevel, selectedPage);
      await this.questionSwitcher(selectedLevel, selectedPage);
    });

    this.container.addEventListener('question-answered', async (event: Event): Promise<void> => {
      if (this.auth.isUserAuthorized()) {
        await this.resultProcessor.processAnswer('sprint', (event as CustomEvent).detail);
      }
    });
  }

  private async questionSwitcher(level: number, levelPage?: number): Promise<void> {
    const waitingMessageContainer: HTMLHeadingElement =
      this.mainView.createWaitingMessageContainer();
    this.container.append(waitingMessageContainer);

    const questionInfoList: ISprintQuestionInfo[] = await this.questionListCreator.getQuestionList(
      level,
      levelPage
    );
    waitingMessageContainer.remove();

    if (!questionInfoList.length) {
      this.finalPage.renderReturnPage(this.container, level);
      return;
    }
    console.log(level, levelPage, questionInfoList);

    this.mainView.renderMainElements();
    this.startTimer();

    const questionCardWrapper: HTMLDivElement = this.container.querySelector(
      '.game-card__question-card-wrapper'
    ) as HTMLDivElement;

    this.questionCardConstructor.createQuestionCardWraper(
      questionInfoList[Numbers.Zero],
      Numbers.Zero,
      questionCardWrapper
    );

    this.container.addEventListener('question-answered', (): void => {
      const questionNumber = Number(
        (this.container.querySelector('.game-card__question-card') as HTMLDivElement).dataset
          .questionNumber as string
      );

      this.gameResults.push({
        correctAnswer: questionInfoList[questionNumber].correctAnswer,
        isCorrect:
          (document.querySelector('.game-card__question-card-wrapper') as HTMLDivElement).dataset
            .isUserAnswerCorrect === StringifiedBoolean.True,
      });

      if (questionNumber === questionInfoList.length - Numbers.One) {
        setTimeout((): void => {
          this.clearGameContainer();
          this.finalPage.renderResults(this.container, this.gameResults);
        }, ONE_SECOND);
      } else {
        this.clearQuestionAndButtonsContainers();
        const nextQuestionNumber: number = questionNumber + Numbers.One;
        const buttons: HTMLDivElement = this.mainView.createGameButtons();
        (document.querySelector('.sprint__game-card') as HTMLDivElement).append(buttons);
        this.questionCardConstructor.createQuestionCardWraper(
          questionInfoList[nextQuestionNumber],
          nextQuestionNumber,
          questionCardWrapper
        );
      }
    });
  }

  private startTimer(): void {
    let timerId: NodeJS.Timeout = setTimeout(
      async function tick(that): Promise<void> {
        const timer: HTMLDivElement = document.querySelector('.sprint__timer') as HTMLDivElement;
        if (!timer) {
          clearTimeout(timerId);
          return;
        }
        const currentTime: number = +(timer.textContent as string);
        const newTime = currentTime - Numbers.One;
        timer.textContent = `${newTime}`;
        if (newTime === FIVE_SECONDS) {
          timer.classList.add('sprint__timer_ending-soon');
          await new Audio(timerSound).play();
        }
        timerId = setTimeout(async (): Promise<void> => {
          await tick(that);
        }, ONE_SECOND);
        if (newTime === Numbers.Zero) {
          that.clearGameContainer();
          that.finalPage.renderResults(that.container, that.gameResults);
          clearTimeout(timerId);
        }
      },
      ONE_SECOND,
      this
    );
  }

  private createGameContainer(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['game', 'sprint'],
    });
  }

  private openGameContainer(): void {
    this.clearGameContainer();
    (document.getElementById('app') as HTMLElement).append(this.container);
  }

  private clearGameContainer(): void {
    this.container.innerHTML = NO_CONTENT;
  }

  private clearQuestionAndButtonsContainers(): void {
    (document.querySelector('.game-card__question-card') as HTMLDivElement).remove();
    (document.querySelector('.game-card__buttons') as HTMLDivElement).remove();
  }

  private clearGameResults(): void {
    this.gameResults = [];
  }
}
