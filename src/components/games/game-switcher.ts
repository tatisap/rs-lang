import { DISPLAY_MODES } from '../../constants';
import AudioCallGame from './audiocall';
import SprintGame from './sprint';

export default class GameSwitcher {
  public startNewAudioCallGame(level?: number, levelPage?: number): void {
    this.hideFooter();
    const audiocall: AudioCallGame = new AudioCallGame();
    audiocall.start(level, levelPage);
  }

  public startNewSprintGame(level?: number, levelPage?: number): void {
    this.hideFooter();
    const sprint: SprintGame = new SprintGame();
    sprint.start(level, levelPage);
  }

  private hideFooter(): void {
    (document.querySelector('.footer') as HTMLElement).style.display =
      DISPLAY_MODES.contentNotVisible;
  }
}
