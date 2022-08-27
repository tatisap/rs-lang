import { BOOK_SECTIONS, GAME_TITLES, NO_CONTENT } from '../../constants';
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

  public open(gameName: GameName, gameContainer: HTMLDivElement, level?: string): void {
    this.clearContainer();

    this.container.append(
      this.createStartingPageTitle(gamesInfo[gameName].ruName),
      this.createRules(gamesInfo[gameName].rules)
    );

    if (!level) {
      const levels: number[] = Object.values(BOOK_SECTIONS).map(
        (_, index: number): number => index + Numbers.One
      );
      levels.pop();

      const levelSelection: HTMLDivElement = this.createLevelSelection(levels);
      levelSelection.addEventListener('click', (event: Event): void =>
        this.levelSelectionHandler(event)
      );
      this.container.append(levelSelection);
    } else {
      const startGameButton: HTMLButtonElement = this.createStartGameButton();
      startGameButton.addEventListener('click', (event: Event): void =>
        this.dispatchLevelSelectedEvent(event.target as HTMLButtonElement, level as string)
      );
      this.container.append(startGameButton);
    }
    gameContainer.append(this.container);
  }

  private levelSelectionHandler(event: Event): void {
    const option: HTMLLIElement = event.target as HTMLLIElement;
    if (!option.classList.contains('level-selection__option')) return;
    this.dispatchLevelSelectedEvent(option, option.textContent as string);
  }

  private dispatchLevelSelectedEvent(target: HTMLElement, level: string): void {
    target.dispatchEvent(
      new CustomEvent('level-selected', {
        bubbles: true,
        detail: { selectedLevel: level },
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

  private createStartGameButton(): HTMLButtonElement {
    return this.elementCreator.createUIElement<HTMLButtonElement>({
      tag: 'button',
      classNames: ['game__start-game-button'],
      innerText: GAME_TITLES.startGame,
    });
  }

  private clearContainer(): void {
    this.container.innerHTML = NO_CONTENT;
  }
}
