import { IElement, IInput, ILabel, IMediaElement } from '../types';

export default class UIElementsConstructor {
  public createUIElement = <T extends HTMLElement>(elementInfo: IElement): T => {
    const { tag, classNames, innerText, innerHTML } = elementInfo;
    const element: T = document.createElement(tag) as T;
    element.classList.add(...classNames);
    if (innerText) element.textContent = innerText;
    if (innerHTML) element.innerHTML = innerHTML;
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

  public createImage(imageInfo: IMediaElement): HTMLDivElement {
    const image: HTMLDivElement = this.createUIElement<HTMLDivElement>({
      tag: 'div',
      ...imageInfo,
    });
    image.style.backgroundImage = `url(${imageInfo.url})`;
    return image;
  }

  public createAudio(audioInfo: IMediaElement): HTMLAudioElement {
    const audio: HTMLAudioElement = this.createUIElement<HTMLAudioElement>({
      tag: 'audio',
      ...audioInfo,
    });
    audio.src = audioInfo.url;
    return audio;
  }
}
