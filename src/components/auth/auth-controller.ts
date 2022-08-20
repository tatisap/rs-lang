import UserAPI from '../../api/user-api';
import { AUTH_ERROR_MESSAGE, STORAGE_KEYS } from '../../constants';
import {
  ErrorPath,
  IAuthStatus,
  IResponse,
  ISignUpError,
  IUser,
  IUserTokens,
  Numbers,
  StatusCode,
} from '../../types';

export default class AuthController {
  private api: UserAPI;

  constructor() {
    this.api = new UserAPI();
  }

  public async signUp(credentials: Omit<IUser, 'name'>): Promise<IAuthStatus> {
    const user: IUser = { name: credentials.email, ...credentials };
    const serverResponse: IResponse = await this.api.createUser(user);

    if (serverResponse.statusCode === StatusCode.Ok) {
      await this.signIn(credentials);
      return { isSuccess: true };
    }

    if (serverResponse.statusCode === StatusCode.UnprocessableEntity) {
      const path: ErrorPath = (serverResponse.content as ISignUpError).error.errors[Numbers.Zero]
        .path[Numbers.Zero];
      return {
        isSuccess: false,
        errorMessage: AUTH_ERROR_MESSAGE[path],
      };
    }

    if (serverResponse.statusCode === StatusCode.ExpectationFailed) {
      return { isSuccess: false, errorMessage: AUTH_ERROR_MESSAGE.userExists };
    }

    return { isSuccess: false, errorMessage: AUTH_ERROR_MESSAGE.later };
  }

  public async signIn(credentials: Omit<IUser, 'name'>): Promise<IAuthStatus> {
    const serverResponse: IResponse = await this.api.signIn(credentials);

    if (serverResponse.statusCode === StatusCode.Ok) {
      this.saveConfidentialInfo(serverResponse.content as IUserTokens);
      return { isSuccess: true };
    }

    if (
      serverResponse.statusCode === StatusCode.Forbidden ||
      serverResponse.statusCode === StatusCode.NotFound
    ) {
      return { isSuccess: false, errorMessage: AUTH_ERROR_MESSAGE.invalidCredentials };
    }

    return { isSuccess: false, errorMessage: AUTH_ERROR_MESSAGE.later };
  }

  public saveConfidentialInfo(info: IUserTokens): void {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(info));
  }

  public removeConfidentialInfo(): void {
    localStorage.removeItem(STORAGE_KEYS.user);
  }

  public isUserAuthorized(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.user);
  }
}
