import { ERRORS_MESSAGES } from '../../constants';
import { IRequestParameters } from '../../types';
import AuthController from '../auth/auth-controller';

export default class RequestProcessor {
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
  }

  public async process<T>(
    request: (parameters: IRequestParameters) => Promise<T>,
    args?: Omit<IRequestParameters, 'userId' | 'token'>
  ): Promise<T> {
    const userId: string = this.authController.getUserId();
    let token: string = this.authController.getAccessToken();
    try {
      return await request({ userId, token, ...args });
    } catch (error) {
      if (error instanceof Error && error.message === ERRORS_MESSAGES.unauthorized) {
        await this.authController.updateTokens();
        token = this.authController.getAccessToken();
        return await request({ userId, token, ...args });
      }
      throw error;
    }
  }
}
