import { NO_CONTENT } from '../constants';
import UIElementsConstructor from '../utils/ui-elements-creator';

export default class ModalWindow {
  private elementCreator: UIElementsConstructor;

  public modalWrapper: HTMLDivElement;

  public modalContent: HTMLDivElement;

  public closeButton: HTMLButtonElement;

  public titleElement: HTMLHeadingElement;

  constructor(modalTitle: string) {
    this.elementCreator = new UIElementsConstructor();
    this.modalWrapper = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['modal__wrapper'],
    });
    const modalElement: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['modal'],
    });
    this.closeButton = this.elementCreator.createUIElement<HTMLButtonElement>({
      tag: 'button',
      classNames: ['modal__close-button', 'close-button'],
    });
    this.titleElement = this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['modal__title'],
      innerText: modalTitle,
    });
    this.modalContent = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['modal__content'],
    });
    modalElement.append(this.closeButton, this.titleElement, this.modalContent);
    this.modalWrapper.append(modalElement);
  }

  public init(): ModalWindow {
    this.closeButton.addEventListener('click', (): void => this.close());
    return this;
  }

  public open(): void {
    document.body.append(this.modalWrapper);
  }

  public close(): void {
    this.clear();
    this.modalWrapper.remove();
  }

  public clear(): void {
    this.modalContent.innerHTML = NO_CONTENT;
  }

  public setModalTitle(modalTitle: string): void {
    this.titleElement.textContent = modalTitle;
  }

  public addContent(...content: HTMLElement[]): void {
    this.modalContent.append(...content);
  }
}
