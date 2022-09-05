import {
  MilliSeconds,
  Numbers,
  SprintPointsPerAnswer,
  ISprintQuestionInfo,
  KeyboardCode,
  IGameQuestionResult,
} from '../../../../types';
import wrongAnswerAudio from '../../../../assets/mp3/wrong-answer.mp3';
import correctAnswerAudio from '../../../../assets/mp3/correct-answer.mp3';
import higherPointsAudio from '../../../../assets/mp3/higher-points.mp3';
import { SPRINT_BREAKPOINTS, SPRINT_INFO } from '../../../../constants';

export default class AnswerProcessor {
  public async init(
    questionInfo: ISprintQuestionInfo,
    event: MouseEvent | KeyboardEvent
  ): Promise<void> {
    let isUserAnswerCorrect = false;
    const isQuestionCorrect: boolean = questionInfo.answerOption.isCorrect;

    if (event.type === 'click') {
      if (
        (isQuestionCorrect &&
          (event.target as HTMLButtonElement).classList.contains('buttons__correct')) ||
        (!isQuestionCorrect &&
          (event.target as HTMLButtonElement).classList.contains('buttons__incorrect'))
      ) {
        isUserAnswerCorrect = true;
      }
    }

    if (event.type === 'keydown') {
      if (
        (isQuestionCorrect && (event as KeyboardEvent).code === KeyboardCode.ArrowRight) ||
        (!isQuestionCorrect && (event as KeyboardEvent).code === KeyboardCode.ArrowLeft)
      ) {
        isUserAnswerCorrect = true;
      }
    }

    (
      document.querySelector('.game-card__question-card-wrapper') as HTMLDivElement
    ).dataset.isUserAnswerCorrect = `${isUserAnswerCorrect}`;

    (document.querySelector('.game.sprint') as HTMLDivElement).dispatchEvent(
      new CustomEvent('question-answered', {
        bubbles: true,
        detail: {
          isCorrect: isUserAnswerCorrect,
          correctAnswer: questionInfo.correctAnswer,
        } as IGameQuestionResult,
      })
    );

    if (isUserAnswerCorrect) {
      await new Audio(correctAnswerAudio).play();
    } else {
      await new Audio(wrongAnswerAudio).play();
    }
    await this.updateOnAnswerResult(isUserAnswerCorrect);
  }

  private async updateOnAnswerResult(answer: boolean): Promise<void> {
    const questionWrapper: HTMLDivElement = document.querySelector(
      '.game-card__question-card-wrapper'
    ) as HTMLDivElement;
    let correctAnswers = Number(questionWrapper.dataset.currentCorrectAnswers as string);
    if (answer) {
      correctAnswers += Numbers.One;
      this.updateMainForCorrect();
      switch (true) {
        case correctAnswers < SPRINT_BREAKPOINTS.forTwentyPoints:
          this.updateTotalScore(SprintPointsPerAnswer.Ten);
          this.updateCounterItems(correctAnswers - Numbers.One);
          break;
        case correctAnswers === SPRINT_BREAKPOINTS.forTwentyPoints:
          await new Audio(higherPointsAudio).play();
          this.updateTotalScore(SprintPointsPerAnswer.Twenty);
          this.updatePointsInfo(SprintPointsPerAnswer.Twenty, 'counter-info_first-points-increase');
          this.resetCounterItems();
          break;
        case correctAnswers > SPRINT_BREAKPOINTS.forTwentyPoints &&
          correctAnswers < SPRINT_BREAKPOINTS.forFourtyPoints:
          this.updateTotalScore(SprintPointsPerAnswer.Twenty);
          this.updateCounterItems(correctAnswers - Numbers.Five);
          break;
        case correctAnswers === SPRINT_BREAKPOINTS.forFourtyPoints:
          await new Audio(higherPointsAudio).play();
          this.updateTotalScore(SprintPointsPerAnswer.Fourty);
          this.updatePointsInfo(
            SprintPointsPerAnswer.Fourty,
            'counter-info_second-points-increase'
          );
          this.resetCounterItems();
          break;
        case correctAnswers > SPRINT_BREAKPOINTS.forFourtyPoints &&
          correctAnswers < SPRINT_BREAKPOINTS.forEightyPoints:
          this.updateTotalScore(SprintPointsPerAnswer.Fourty);
          this.updateCounterItems(correctAnswers - Numbers.Nine);
          break;
        case correctAnswers === SPRINT_BREAKPOINTS.forEightyPoints:
          await new Audio(higherPointsAudio).play();
          this.updateTotalScore(SprintPointsPerAnswer.Eighty);
          this.updatePointsInfo(SprintPointsPerAnswer.Eighty, 'counter-info_third-points-increase');
          this.hideExtraCounterItems();
          break;
        case correctAnswers > SPRINT_BREAKPOINTS.forEightyPoints:
          this.updateTotalScore(SprintPointsPerAnswer.Eighty);
          break;
        default:
          break;
      }
    } else {
      correctAnswers = Numbers.Zero;
      this.updateForIncorrect();
    }
    questionWrapper.dataset.currentCorrectAnswers = `${correctAnswers}`;
  }

  private updateForIncorrect(): void {
    (document.querySelector('.game-card__counter-info') as HTMLDivElement).classList.remove(
      'counter-info_first-points-increase',
      'counter-info_second-points-increase',
      'counter-info_third-points-increase'
    );

    this.resetCounterItems();

    const pointPerAnswerContainer: HTMLParagraphElement = document.querySelector(
      '.counter-info__points-per-answer'
    ) as HTMLParagraphElement;
    pointPerAnswerContainer.textContent = SPRINT_INFO.defaultPointsPerWord;

    this.styleOnAnswer('sprint__game-card_incorrect', 'answer-check__incorrect');
  }

  private updateMainForCorrect(): void {
    this.styleOnAnswer('sprint__game-card_correct', 'answer-check__correct');
  }

  private styleOnAnswer(gameCardStylesClass: string, checkerClass: string): void {
    const gameCard: HTMLDivElement = document.querySelector('.sprint__game-card') as HTMLDivElement;
    gameCard.classList.add(gameCardStylesClass);
    const checker: HTMLDivElement = document.querySelector(`.${checkerClass}`) as HTMLDivElement;
    checker.classList.add('visible');

    setTimeout((): void => {
      gameCard.classList.remove(gameCardStylesClass);
      checker.classList.remove('visible');
    }, MilliSeconds.One);
  }

  private updateCounterItems(answerNumber: number): void {
    const counterItems: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      '.counter__item'
    ) as NodeListOf<HTMLDivElement>;
    counterItems.forEach((item: HTMLDivElement): void => {
      item.classList.remove('counter__item_hidden');
    });
    counterItems[answerNumber].classList.add('counter__item_answered');
  }

  private resetCounterItems(): void {
    const counterItems: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      '.counter__item'
    ) as NodeListOf<HTMLDivElement>;
    counterItems.forEach((item: HTMLDivElement): void => {
      item.classList.remove('counter__item_answered', 'counter__item_hidden');
    });
  }

  private hideExtraCounterItems(): void {
    const counterItems: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      '.counter__item'
    ) as NodeListOf<HTMLDivElement>;
    counterItems.forEach((item: HTMLDivElement, index: number): void => {
      if (index !== Numbers.Zero) {
        item.classList.add('counter__item_hidden');
      }
    });
  }

  private updateTotalScore(pointsForCorrect: number): void {
    const totalPointsContainer: HTMLParagraphElement = document.querySelector(
      '.game-points__amount'
    ) as HTMLParagraphElement;
    const totalPoints: number = +(totalPointsContainer.textContent as string);
    totalPointsContainer.textContent = `${totalPoints + pointsForCorrect}`;
  }

  private updatePointsInfo(pointsForCorrect: number, className: string): void {
    const pointsInfoContainer: HTMLDivElement = document.querySelector(
      '.game-card__counter-info'
    ) as HTMLDivElement;
    pointsInfoContainer.classList.remove(
      'counter-info_first-points-increase',
      'counter-info_second-points-increase',
      'counter-info_third-points-increase'
    );
    pointsInfoContainer.classList.add(className);

    const pointPerAnswerContainer: HTMLParagraphElement = document.querySelector(
      '.counter-info__points-per-answer'
    ) as HTMLParagraphElement;
    pointPerAnswerContainer.textContent = `+${pointsForCorrect} ${SPRINT_INFO.pointsPerWord}`;
  }
}
