import { GAME_RESULTS_TITLE, NO_CONTENT } from '../../constants';
import { IGameCorrectAnswer, IGameQuestionResult } from '../../types';
import UIElementsConstructor from '../../utils/ui-elements-creator';
import AudioElement from './audio-element';

export default class GameFinalPage {
  private elementCreator: UIElementsConstructor;

  private container: HTMLDivElement;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.container = this.createFinalPageContainer();
  }

  public renderResults(gameContainer: HTMLDivElement, results: IGameQuestionResult[]) {
    this.container.innerHTML = NO_CONTENT;
    const correctResults: IGameCorrectAnswer[] = results
      .filter((result: IGameQuestionResult): boolean => result.isCorrect)
      .map((result: IGameQuestionResult): IGameCorrectAnswer => result.correctAnswer);
    const incorrectResults: IGameCorrectAnswer[] = results
      .filter((result: IGameQuestionResult): boolean => !result.isCorrect)
      .map((result: IGameQuestionResult): IGameCorrectAnswer => result.correctAnswer);

    this.container.append(
      this.createFinalPageTitle(),
      this.createResultList('correct', correctResults),
      this.createResultList('incorrect', incorrectResults)
    );
    gameContainer.append(this.container);
  }

  private createFinalPageContainer(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['game__final-page', 'final-page'],
    });
  }

  private createFinalPageTitle(): HTMLHeadingElement {
    return this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['final-page__title'],
      innerText: GAME_RESULTS_TITLE,
    });
  }

  private createResultList(modifier: string, listInfo: IGameCorrectAnswer[]): HTMLUListElement {
    const resultList: HTMLUListElement = this.elementCreator.createUIElement<HTMLUListElement>({
      tag: 'ul',
      classNames: ['result-list', `result-list_${modifier}`],
    });
    resultList.append(
      ...listInfo.map(
        (answerInfo: IGameCorrectAnswer): HTMLLIElement => this.createResultListItem(answerInfo)
      )
    );
    return resultList;
  }

  private createResultListItem(answerInfo: IGameCorrectAnswer): HTMLLIElement {
    const item: HTMLLIElement = this.elementCreator.createUIElement<HTMLLIElement>({
      tag: 'li',
      classNames: ['result-list__item'],
      innerText: `${answerInfo.word} - ${answerInfo.wordTranslation}`,
    });
    item.prepend(new AudioElement(answerInfo.audioUrl).init().getAudioElement());
    return item;
  }
}
