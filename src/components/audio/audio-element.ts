import { Numbers } from '../../types';
import UIElementsConstructor from '../../utils/ui-elements-creator';

export default class AudioElement {
  private elementCreator: UIElementsConstructor;

  private wrapper: HTMLDivElement;

  private audios: HTMLAudioElement[];

  constructor(audioUrls: string[]) {
    this.elementCreator = new UIElementsConstructor();
    this.wrapper = this.createAudioWrapper();
    this.audios = audioUrls.map(this.createAudio, this);
  }

  public init(): AudioElement {
    this.wrapper.addEventListener('click', async (): Promise<void> => this.toggleAudio());
    this.wrapper.addEventListener('now-playing', (): void => this.stop());
    this.audios.at(-Numbers.One)?.addEventListener('ended', () => this.disableSoundAnimation());
    this.audios.forEach((audio: HTMLAudioElement, index: number): void => {
      if (index < this.audios.length - Numbers.One) {
        audio.addEventListener('ended', async (): Promise<void> => {
          await this.audios[index + Numbers.One].play();
        });
      }
    });
    return this;
  }

  public getAudioElement(): HTMLDivElement {
    return this.wrapper;
  }

  public addClassWithModifier(modifier: string): void {
    this.wrapper.classList.add(`audio-wrapper_${modifier}`);
    this.audios.forEach((audio: HTMLAudioElement): void =>
      audio.classList.add(`audio_${modifier}`)
    );
  }

  public removeClassWithModifier(modifier: string): void {
    this.wrapper.classList.remove(`audio-wrapper_${modifier}`);
    this.audios.forEach((audio: HTMLAudioElement): void =>
      audio.classList.remove(`audio_${modifier}`)
    );
  }

  public async play(): Promise<void> {
    this.dispatchNowPlayingEvent();
    this.enableSoundAnimation();
    await this.audios[Numbers.Zero].play();
  }

  public stop(): void {
    this.audios.forEach((audio: HTMLAudioElement): void => {
      const playingAudio = audio;
      playingAudio.pause();
      playingAudio.currentTime = Numbers.Zero;
    });
    this.disableSoundAnimation();
  }

  private async toggleAudio(): Promise<void> {
    if (!this.wrapper.classList.contains('audio-wrapper_audio-playing')) {
      await this.play();
    } else {
      this.stop();
    }
  }

  private dispatchNowPlayingEvent(): void {
    (document.querySelectorAll('.audio-wrapper') as NodeListOf<HTMLDivElement>).forEach(
      (audioElement: HTMLDivElement): void => {
        audioElement.dispatchEvent(new Event('now-playing'));
      }
    );
  }

  private enableSoundAnimation(): void {
    this.wrapper.classList.add('audio-wrapper_audio-playing');
  }

  private disableSoundAnimation(): void {
    this.wrapper.classList.remove('audio-wrapper_audio-playing');
  }

  private createAudioWrapper(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['audio-wrapper'],
    });
  }

  private createAudio(audioUrl: string): HTMLAudioElement {
    return this.elementCreator.createAudio({
      classNames: ['audio'],
      url: audioUrl,
    });
  }
}
