import AudioCallGame from './audiocall';

export default class GameSwitcher {
  public startNewAudioCallGame(level?: number, levelPage?: number): void {
    const audiocall: AudioCallGame = new AudioCallGame();
    audiocall.start(level, levelPage);
  }

  public startNewSprintGame(): void {}
}
