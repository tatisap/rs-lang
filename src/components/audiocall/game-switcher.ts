import AudioCallView from './audiocall-view';

export default class GameSwitcher {
  public startNewAudioCallGame(): void {
    const audiocall: AudioCallView = new AudioCallView();
    audiocall.start();
  }

  public startNewSprintGame(): void {}
}
