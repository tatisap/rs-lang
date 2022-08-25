import { BOOK_SECTIONS, GAME_TITLES, NO_CONTENT, STORAGE_KEYS } from '../../constants';
import UIElementsConstructor from '../../utils/ui-elements-creator';
import gamesInfo from '../../data/games-info.json';
import { GameName, Numbers } from '../../types';

export default class GameStartingPage {
  private elementCreator: UIElementsConstructor;

  private container: HTMLDivElement;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.container = this.createStartingPageContainer();
  }

  public open(gameName: GameName, gameContainer: HTMLDivElement): void {
    this.clearContainer();
    const isUserAuthorized = !!localStorage.getItem(STORAGE_KEYS.user);
    const levels: number[] = Object.values(BOOK_SECTIONS).map(
      (_, index: number): number => index + Numbers.One
    );
    if (!isUserAuthorized) levels.pop();
    const levelSelection: HTMLDivElement = this.createLevelSelection(levels);
    levelSelection.addEventListener('click', this.levelSelectionHandler);
    this.container.append(
      this.createStartingPageTitle(gamesInfo[gameName].ruName),
      this.createRules(gamesInfo[gameName].rules),
      levelSelection
    );
    gameContainer.append(this.container);
  }

  private levelSelectionHandler(event: Event): void {
    const option: HTMLLIElement = event.target as HTMLLIElement;
    if (!option.classList.contains('level-selection__option')) return;
    option.dispatchEvent(
      new CustomEvent('level-selected', {
        bubbles: true,
        detail: { selectedLevel: option.textContent },
      })
    );
  }

  private createStartingPageContainer(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['game__starting-page', 'starting-page'],
    });
  }

  private createStartingPageTitle(gameName: string): HTMLHeadingElement {
    return this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['starting-page__title'],
      innerText: gameName,
    });
  }

  private createRules(rules: string[]): HTMLUListElement {
    const rulesContainer: HTMLUListElement = this.elementCreator.createUIElement<HTMLUListElement>({
      tag: 'div',
      classNames: ['starting-page__rules-list'],
    });
    rulesContainer.append(
      ...rules.map((rule: string): HTMLLIElement => {
        return this.elementCreator.createUIElement<HTMLLIElement>({
          tag: 'li',
          classNames: ['starting-page__rule'],
          innerText: rule,
        });
      })
    );
    return rulesContainer;
  }

  private createLevelSelection(levels: number[]): HTMLDivElement {
    const levelSelectionContainer: HTMLDivElement =
      this.elementCreator.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['game__level-selection', 'level-selection'],
      });
    const levelSelectionTitle: HTMLHeadingElement =
      this.elementCreator.createUIElement<HTMLHeadingElement>({
        tag: 'h4',
        classNames: ['level-section__title'],
        innerText: GAME_TITLES.selectionLevel,
      });
    const levelSelectionOptionList: HTMLUListElement =
      this.elementCreator.createUIElement<HTMLUListElement>({
        tag: 'ul',
        classNames: ['level-selection__option-list'],
      });
    levelSelectionOptionList.append(...levels.map(this.createLevelSelectionOption, this));
    levelSelectionContainer.append(levelSelectionTitle, levelSelectionOptionList);
    return levelSelectionContainer;
  }

  private createLevelSelectionOption(level: number): HTMLLIElement {
    return this.elementCreator.createUIElement<HTMLLIElement>({
      tag: 'li',
      classNames: ['level-selection__option'],
      innerText: `${level}`,
    });
  }

  private clearContainer(): void {
    this.container.innerHTML = NO_CONTENT;
  }
}
