import { SPRINT_INFO } from '../../../../constants';
import { Numbers } from '../../../../types';
import UIElementsConstructor from '../../../../utils/ui-elements-creator';

export default class SprintMainView {
  private elementConstructor: UIElementsConstructor;

  constructor() {
    this.elementConstructor = new UIElementsConstructor();
  }

  public renderMainElements(): void {
    const gameContainer: HTMLDivElement = document.querySelector('.game.sprint') as HTMLDivElement;
    gameContainer.append(
      this.createTotalPointsContainer(),
      this.createTimer(),
      this.createGameCard()
    );
  }

  private createTotalPointsContainer(): HTMLDivElement {
    const totalPointsContainer: HTMLDivElement =
      this.elementConstructor.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['sprint__game-points', 'game-points'],
      });

    const description: HTMLParagraphElement =
      this.elementConstructor.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['game-points__description'],
        innerText: SPRINT_INFO.pointsTotal,
      });
    const pointsAmount: HTMLParagraphElement =
      this.elementConstructor.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['game-points__amount'],
        innerText: Numbers.Zero.toString(),
      });
    totalPointsContainer.append(description, pointsAmount);
    return totalPointsContainer;
  }

  private createTimer(): HTMLDivElement {
    return this.elementConstructor.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['sprint__timer'],
      innerText: SPRINT_INFO.maxSeconds,
    });
  }

  private createGameCard(): HTMLDivElement {
    const gameCard: HTMLDivElement = this.elementConstructor.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['sprint__game-card', 'game-card'],
    });
    gameCard.append(
      this.createCounterContainer(),
      this.createQuestionCardWrapper(),
      this.createAnswerCheckContainer(),
      this.createGameButtons()
    );
    return gameCard;
  }

  private createCounterContainer(): HTMLDivElement {
    const counterContainer: HTMLDivElement =
      this.elementConstructor.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['game-card__counter-info', 'counter-info'],
      });

    const pointsInfo: HTMLParagraphElement =
      this.elementConstructor.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['counter-info__points-per-answer'],
        innerText: SPRINT_INFO.defaultPointsPerWord,
      });
    counterContainer.append(this.createCounters(), pointsInfo);
    return counterContainer;
  }

  private createCounters(): HTMLDivElement {
    const counters: HTMLDivElement = this.elementConstructor.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['counter-info__counters', 'counter'],
    });
    counters.append(this.createCounterItem(), this.createCounterItem(), this.createCounterItem());
    return counters;
  }

  private createCounterItem(): HTMLDivElement {
    return this.elementConstructor.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['counter__item'],
    });
  }

  private createQuestionCardWrapper(): HTMLDivElement {
    const questionCardWrapper: HTMLDivElement =
      this.elementConstructor.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['game-card__question-card-wrapper'],
      });
    questionCardWrapper.dataset.currentCorrectAnswers = `${Numbers.Zero}`;
    return questionCardWrapper;
  }

  private createAnswerCheckContainer(): HTMLDivElement {
    const answerCheckContainer: HTMLDivElement =
      this.elementConstructor.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['game-card__answer-check', 'answer-check'],
      });
    answerCheckContainer.append(
      this.createResultMarkContainer('answer-check__incorrect', SPRINT_INFO.crossMark),
      this.createResultMarkContainer('answer-check__correct', SPRINT_INFO.checkMark)
    );
    return answerCheckContainer;
  }

  private createResultMarkContainer(className: string, text: string): HTMLDivElement {
    return this.elementConstructor.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: [className],
      innerHTML: text,
    });
  }

  public createGameButtons(): HTMLDivElement {
    const gameButtons: HTMLDivElement = this.elementConstructor.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['game-card__buttons', 'buttons'],
    });
    const incorrectButton: HTMLButtonElement =
      this.elementConstructor.createUIElement<HTMLButtonElement>({
        tag: 'button',
        classNames: ['buttons__incorrect'],
        innerText: SPRINT_INFO.incorrect,
      });
    const correctButton: HTMLButtonElement =
      this.elementConstructor.createUIElement<HTMLButtonElement>({
        tag: 'button',
        classNames: ['buttons__correct'],
        innerText: SPRINT_INFO.correct,
      });
    gameButtons.append(incorrectButton, correctButton);
    return gameButtons;
  }

  public createWaitingMessageContainer(): HTMLHeadingElement {
    return this.elementConstructor.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['sprint__wait-message'],
      innerHTML: SPRINT_INFO.waitMessage,
    });
  }
}
