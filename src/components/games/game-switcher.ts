import { DISPLAY_MODES } from '../../constants';
import AudioCallGame from './audiocall';

export default class GameSwitcher {
  public startNewAudioCallGame(level?: number, levelPage?: number): void {
    this.hideFooter();
    const audiocall: AudioCallGame = new AudioCallGame();
    audiocall.start(level, levelPage);
  }

  public startNewSprintGame(): void {
    this.hideFooter();
  }

  private hideFooter(): void {
    (document.querySelector('.footer') as HTMLElement).style.display =
      DISPLAY_MODES.contentNotVisible;
  }
}
