import {
  DISPLAY_MODES,
  GAME_ANSWER_STATUS,
  GAME_INFO_HEADINGS,
  NO_CONTENT,
} from '../../../constants';
import { IGameCorrectAnswer, IGameQuestionResult } from '../../../types';
import UIElementsConstructor from '../../../utils/ui-elements-creator';
import AudioElement from '../../audio/audio-element';

export default class GameFinalPage {
  private elementCreator: UIElementsConstructor;

  private container: HTMLDivElement;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.container = this.createFinalPageContainer();
  }

  public renderResults(gameContainer: HTMLDivElement, results: IGameQuestionResult[]) {
    this.clearContainer();
    const correctResults: IGameCorrectAnswer[] = results
      .filter((result: IGameQuestionResult): boolean => result.isCorrect)
      .map((result: IGameQuestionResult): IGameCorrectAnswer => result.correctAnswer);
    const incorrectResults: IGameCorrectAnswer[] = results
      .filter((result: IGameQuestionResult): boolean => !result.isCorrect)
      .map((result: IGameQuestionResult): IGameCorrectAnswer => result.correctAnswer);

    this.container.append(
      this.createFinalPageTitle(),
      this.createResultList(GAME_ANSWER_STATUS.correct, correctResults),
      this.createResultList(GAME_ANSWER_STATUS.incorrect, incorrectResults)
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
      innerText: GAME_INFO_HEADINGS.results,
    });
  }

  private createResultList(modifier: string, listInfo: IGameCorrectAnswer[]): HTMLDivElement {
    const resultListWrapper: HTMLDivElement = this.elementCreator.createUIElement({
      tag: 'div',
      classNames: ['result-list__wrapper'],
    });
    const resultList: HTMLUListElement = this.elementCreator.createUIElement<HTMLUListElement>({
      tag: 'ul',
      classNames: ['result-list', `result-list_${modifier}`],
    });
    if (listInfo.length) {
      resultList.append(
        ...listInfo.map(
          (answerInfo: IGameCorrectAnswer): HTMLLIElement => this.createResultListItem(answerInfo)
        )
      );
    } else {
      resultList.style.display = DISPLAY_MODES.contentNotVisible;
    }
    resultListWrapper.append(
      this.elementCreator.createUIElement<HTMLHeadingElement>({
        tag: 'h4',
        classNames: ['result-list__title'],
        innerText: `${
          modifier === GAME_ANSWER_STATUS.correct
            ? GAME_INFO_HEADINGS.resultOptions.correct
            : GAME_INFO_HEADINGS.resultOptions.incorrect
        } - ${listInfo.length}`,
      }),
      resultList
    );
    return resultListWrapper;
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

  private clearContainer(): void {
    this.container.innerHTML = NO_CONTENT;
  }
}
