import {
  AUTH_FORM,
  AUTH_MODAL_MODES,
  BUTTON_TEXT,
  DEFAULT_AUTH_MODAL_MODE,
  MODAL_TITLES,
  REDIRECTION_LINK_TEXT,
} from '../../constants';
import { AuthMode } from '../../types';
import CommonView from '../common/view';
import ModalWindow from '../modal-window';

export default class AuthView {
  public mode: AuthMode;

  public modalWindow: ModalWindow;

  public elementCreator: CommonView;

  public errorElement: HTMLDivElement;

  public authForm: HTMLFormElement;

  public redirectionLink: HTMLAnchorElement;

  constructor() {
    this.mode = DEFAULT_AUTH_MODAL_MODE;
    this.elementCreator = new CommonView();
    this.modalWindow = new ModalWindow(MODAL_TITLES[DEFAULT_AUTH_MODAL_MODE]).init();
    this.errorElement = this.createAuthErrorElement();
    this.authForm = this.createAuthFormElement(DEFAULT_AUTH_MODAL_MODE);
    this.redirectionLink = this.createRedirectionLinkElement();
  }

  public createAuthFormElement(mode: AuthMode): HTMLFormElement {
    const form: HTMLFormElement = this.elementCreator.createUIElement<HTMLFormElement>({
      tag: 'form',
      classNames: ['auth-form', `auth-${this.mode.toLowerCase()}`],
    });
    form.append(
      this.elementCreator.createLabel({
        classNames: ['auth-form__label'],
        innerText: AUTH_FORM.email.label,
        htmlFor: AUTH_FORM.email.name,
      }),
      this.elementCreator.createInput({
        classNames: ['auth-form__input'],
        type: AUTH_FORM.email.name,
        name: AUTH_FORM.email.name,
        placeholder: AUTH_FORM.email.placeholder,
      }),
      this.elementCreator.createLabel({
        classNames: ['auth-form__label'],
        innerText: AUTH_FORM.password.label,
        htmlFor: AUTH_FORM.password.name,
      }),
      this.elementCreator.createInput({
        classNames: ['auth-form__input'],
        type: AUTH_FORM.password.name,
        name: AUTH_FORM.password.name,
        placeholder: AUTH_FORM.password.placeholder,
      }),
      this.errorElement,
      this.elementCreator.createUIElement({
        tag: 'button',
        classNames: ['auth-form__submit'],
        innerText: BUTTON_TEXT[mode],
      })
    );
    return form;
  }

  public createAuthErrorElement(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['auth-form__error'],
    });
  }

  public createRedirectionLinkElement(): HTMLAnchorElement {
    return this.elementCreator.createUIElement<HTMLAnchorElement>({
      tag: 'a',
      classNames: ['redirection-link'],
    });
  }

  public initAuthForm(mode: AuthMode): void {
    this.authForm.dataset.mode = mode;
    (this.authForm.querySelector('.auth-form__submit') as HTMLButtonElement).textContent =
      BUTTON_TEXT[mode];
  }

  public clearAuthForm(): void {
    this.authForm.reset();
  }

  public initRedirectionLink(currentMode: AuthMode): void {
    const nextMode =
      currentMode === DEFAULT_AUTH_MODAL_MODE ? AUTH_MODAL_MODES.signUp : AUTH_MODAL_MODES.signIn;
    this.redirectionLink.dataset.nextMode = nextMode;
    this.redirectionLink.textContent = REDIRECTION_LINK_TEXT[nextMode];
  }

  public renderContent(): void {
    this.modalWindow.setModalTitle(MODAL_TITLES[this.mode]);
    this.initAuthForm(this.mode);
    this.initRedirectionLink(this.mode);
    this.modalWindow.addContent(this.authForm, this.redirectionLink);
  }

  public openModal(): AuthView {
    this.modalWindow.open();
    return this;
  }

  public closeModal(): void {
    this.modalWindow.close();
  }

  public setDefaultMode(): void {
    this.mode = DEFAULT_AUTH_MODAL_MODE;
  }

  public changeAuthModalMode(mode: AuthMode): void {
    this.mode = mode;
    this.modalWindow.clear();
    this.renderContent();
  }
}
