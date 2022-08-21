import { AuthMode, IAuthStatus } from '../../types';
import AuthController from './auth-controller';
import AuthView from './auth-view';

export default class Auth {
  private view: AuthView;

  private controller: AuthController;

  private authButton: HTMLButtonElement;

  constructor() {
    this.view = new AuthView();
    this.controller = new AuthController();
    this.authButton = document.querySelector('.auth') as HTMLButtonElement;
  }

  public init(): Auth {
    document.addEventListener('DOMContentLoaded', (): void => {
      if (!this.controller.isUserAuthorized()) this.authButton.classList.add('auth_unauthorized');
    });

    this.authButton.addEventListener('click', (): void => this.handleAuth());

    this.view.modalWindow.closeButton.addEventListener('click', (): void => {
      this.view.closeModal();
    });

    this.view.authForm.addEventListener('submit', async (event: Event): Promise<void> => {
      await this.submitUserInfo(event);
    });

    this.view.redirectionLink.addEventListener('click', (event: Event): void => {
      this.view.changeAuthModalMode(
        (event.target as HTMLAnchorElement).dataset.nextMode as AuthMode
      );
    });

    return this;
  }

  private handleAuth(): void {
    if (this.authButton.classList.contains('auth_unauthorized')) {
      this.view.openModal().renderContent();
    } else {
      this.controller.removeConfidentialInfo();
      document.location.reload();
    }
  }

  private async submitUserInfo(event: Event): Promise<void> {
    event.preventDefault();
    this.view.closeErrorMessage();

    const form: HTMLFormElement = event.target as HTMLFormElement;
    const status: IAuthStatus = await this.controller[form.dataset.mode as AuthMode]({
      email: form.email.value,
      password: form.password.value,
    });

    if (status.isSuccess) {
      document.location.reload();
    } else {
      this.view.errorElement.textContent = `${status.errorMessage}`;
      this.view.openErrorMessage();
    }
  }
}
