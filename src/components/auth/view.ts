import { AUTH_FORM, BUTTON_TEXT, MODAL_TITLES, REDIRECTION_LINK_TEXT } from '../../constants';
import { AuthMode } from '../../types';
import CommonView from '../common/view';
import ModalWindow from '../modal-window';

export default class AuthView {
  public mode: AuthMode;

  public modalWindow: ModalWindow;

  public elementCreator: CommonView;

  public errorElement: HTMLDivElement;

  constructor(mode: AuthMode) {
    this.mode = mode;
    this.modalWindow = new ModalWindow(MODAL_TITLES[mode]);
    this.elementCreator = new CommonView();
    this.errorElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['auth-form__error'],
    });
  }

  public createAuthForm(): HTMLFormElement {
    const form: HTMLFormElement = this.elementCreator.createUIElement<HTMLFormElement>({
      tag: 'form',
      classNames: ['auth-form'],
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
        innerText: BUTTON_TEXT[this.mode],
      })
    );
    return form;
  }

  public createRedirection(): HTMLAnchorElement {
    const redirectionLink: HTMLAnchorElement =
      this.elementCreator.createUIElement<HTMLAnchorElement>({
        tag: 'a',
        classNames: ['redirection-link'],
        innerText:
          this.mode === 'signIn' ? REDIRECTION_LINK_TEXT.signUp : REDIRECTION_LINK_TEXT.signIn,
      });
    redirectionLink.addEventListener('click', (): void => {
      this.changeMode(this.mode === 'signIn' ? 'signUp' : 'signIn');
    });
    return redirectionLink;
  }

  public renderContent(): void {
    this.modalWindow.addContent(this.createAuthForm(), this.createRedirection());
  }

  public openModal(): AuthView {
    this.modalWindow.open();
    return this;
  }

  public closeModal(): void {
    this.modalWindow.close();
  }

  public changeMode(mode: AuthMode): void {
    this.mode = mode;
    this.modalWindow.setModalTitle(MODAL_TITLES[this.mode]);
    this.modalWindow.clear();
    this.renderContent();
  }
}
