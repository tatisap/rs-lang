import UIElementsConstructor from '../../../utils/ui-elements-creator';

export default class AudioElement {
  private elementCreator: UIElementsConstructor;

  private wrapper: HTMLDivElement;

  private audio: HTMLAudioElement;

  constructor(audoUrl: string) {
    this.elementCreator = new UIElementsConstructor();
    this.wrapper = this.createAudioWrapper();
    this.audio = this.createAudio(audoUrl);
  }

  public init(): AudioElement {
    this.wrapper.append(this.audio);
    this.wrapper.addEventListener('click', async (): Promise<void> => {
      await this.playAudio();
    });
    this.audio.addEventListener('ended', () => this.disableSoundAnimation());
    return this;
  }

  public getAudioElement(): HTMLDivElement {
    return this.wrapper;
  }

  public async playAudio(): Promise<void> {
    this.enableSoundAnimation();
    await this.audio.play();
  }

  private enableSoundAnimation(): void {
    this.wrapper.classList.add('audio-wrapper_audio-playing');
  }

  private disableSoundAnimation(): void {
    this.wrapper.classList.remove('audio-wrapper_audio-playing');
  }

  public addClassWithModifier(modifier: string): void {
    this.wrapper.classList.add(`audio-wrapper_${modifier}`);
    this.audio.classList.add(`audio_${modifier}`);
  }

  public removeClassWithModifier(modifier: string): void {
    this.wrapper.classList.remove(`audio-wrapper_${modifier}`);
    this.audio.classList.remove(`audio_${modifier}`);
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
