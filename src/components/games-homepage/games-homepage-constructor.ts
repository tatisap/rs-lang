import { GAMES, GAME_TITLES, PAGE_TITLES } from '../../constants';
import { IGameInfo } from '../../types';
import UIElementsConstructor from '../../utils/ui-elements-creator';

export default class GamesHomepageConstructor {
  private elementCreator: UIElementsConstructor;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
  }

  public createPageTitle(): HTMLHeadingElement {
    return this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h2',
      classNames: ['page__title'],
      innerText: PAGE_TITLES.games,
    });
  }

  private createGameListTitle(): HTMLHeadingElement {
    return this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['game-list__title'],
      innerText: GAME_TITLES.selectionGame,
    });
  }

  private createGameItem(className: string, gameName: string): HTMLLIElement {
    return this.elementCreator.createUIElement<HTMLLIElement>({
      tag: 'li',
      classNames: ['game-list__item', `${className}-game`],
      innerText: gameName,
    });
  }

  private createGameList(): HTMLUListElement {
    const gameList: HTMLUListElement = this.elementCreator.createUIElement<HTMLUListElement>({
      tag: 'ul',
      classNames: ['game-list'],
    });
    gameList.append(
      ...(Object.values(GAMES) as IGameInfo[]).map(
        (game: IGameInfo): HTMLLIElement => this.createGameItem(game.className, game.name)
      )
    );
    return gameList;
  }

  private createGameListImage(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['game-list__image'],
    });
  }

  public createGameListContainer(): HTMLDivElement {
    const gameListContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['game-list__container'],
    });
    gameListContainer.append(
      this.createGameListTitle(),
      this.createGameList(),
      this.createGameListImage()
    );
    return gameListContainer;
  }
}
