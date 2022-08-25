import { GAMES } from '../../constants';
import { GameName } from '../../types';
import GameSwitcher from '../audiocall/game-switcher';
import GamesHomepageConstructor from './games-homepage-constructor';

export default class GamesHomepage {
  private uiConstructor: GamesHomepageConstructor;

  private gameSwitcher: GameSwitcher;

  constructor() {
    this.uiConstructor = new GamesHomepageConstructor();
    this.gameSwitcher = new GameSwitcher();
  }

  public renderPage(): void {
    const pageContainer: HTMLElement = document.getElementById('app') as HTMLElement;
    pageContainer.classList.add('page_games');
    pageContainer.append(
      this.uiConstructor.createPageTitle(),
      this.uiConstructor.createGameListContainer()
    );
    (Object.keys(GAMES) as GameName[]).forEach((gameName: GameName): void => {
      (pageContainer.querySelector(`.${gameName}-game`) as HTMLLIElement).addEventListener(
        'click',
        (): void => this.switchGame(gameName)
      );
    });
  }

  private switchGame(gameName: GameName): void {
    switch (gameName) {
      case GAMES.audiocall.className:
        this.gameSwitcher.startNewAudioCallGame();
        break;
      case GAMES.sprint.className:
        this.gameSwitcher.startNewSprintGame();
        break;
      default:
        break;
    }
  }
}
