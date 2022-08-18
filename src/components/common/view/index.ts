import { IElement } from '../../../types';

export default class CommonView {
  public createUIElement = <T extends HTMLElement>(elementInfo: IElement): T => {
    const { tag, classNames, innerText } = elementInfo;
    const element: T = document.createElement(tag) as T;
    element.classList.add(...classNames);
    if (innerText) element.textContent = innerText;
    return element;
  };
}
