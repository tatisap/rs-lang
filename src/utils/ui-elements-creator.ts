import { IAudioElement, IElement, IImageElement, IInput, ILabel } from '../types';

export default class UIElementsConstructor {
  public createUIElement = <T extends HTMLElement>(elementInfo: IElement): T => {
    const { tag, classNames, innerText } = elementInfo;
    const element: T = document.createElement(tag) as T;
    element.classList.add(...classNames);
    if (innerText) element.textContent = innerText;
    return element;
  };

  public createInput(inputInfo: IInput): HTMLInputElement {
    const input: HTMLInputElement = this.createUIElement<HTMLInputElement>({
      tag: 'input',
      ...inputInfo,
    });
    input.type = inputInfo.type;
    input.name = inputInfo.name;
    input.placeholder = inputInfo.placeholder;
    return input;
  }

  public createLabel(labelInfo: ILabel): HTMLLabelElement {
    const label: HTMLLabelElement = this.createUIElement<HTMLLabelElement>({
      tag: 'label',
      ...labelInfo,
    });
    label.htmlFor = labelInfo.htmlFor;
    return label;
  }

  public createImage(imageInfo: IImageElement): HTMLImageElement {
    const image: HTMLImageElement = this.createUIElement<HTMLImageElement>({
      tag: 'img',
      ...imageInfo,
    });
    image.src = imageInfo.src;
    return image;
  }

  public createAudio(audioInfo: IAudioElement): HTMLAudioElement {
    const audio: HTMLAudioElement = this.createUIElement<HTMLAudioElement>({
      tag: 'audio',
      ...audioInfo,
    });
    audio.src = audioInfo.src;
    return audio;
  }
}
