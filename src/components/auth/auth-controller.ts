import UserAPI from '../../api/user-api';
import { AUTH_ERROR_MESSAGE, STORAGE_KEYS } from '../../constants';
import {
  ErrorPath,
  IAuthStatus,
  IResponse,
  ISignUpError,
  ITokens,
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

    switch (serverResponse.statusCode) {
      case StatusCode.Ok: {
        await this.signIn(credentials);
        return { isSuccess: true };
      }
      case StatusCode.UnprocessableEntity: {
        const path: ErrorPath = (serverResponse.content as ISignUpError).error.errors[Numbers.Zero]
          .path[Numbers.Zero];
        return {
          isSuccess: false,
          errorMessage: AUTH_ERROR_MESSAGE[path],
        };
      }
      case StatusCode.ExpectationFailed: {
        return { isSuccess: false, errorMessage: AUTH_ERROR_MESSAGE.userExists };
      }
      default: {
        return { isSuccess: false, errorMessage: AUTH_ERROR_MESSAGE.later };
      }
    }
  }

  public async signIn(credentials: Omit<IUser, 'name'>): Promise<IAuthStatus> {
    const serverResponse: IResponse = await this.api.signIn(credentials);

    switch (serverResponse.statusCode) {
      case StatusCode.Ok: {
        this.saveConfidentialInfo(serverResponse.content as IUserTokens);
        return { isSuccess: true };
      }
      case StatusCode.Forbidden:
      case StatusCode.NotFound: {
        return { isSuccess: false, errorMessage: AUTH_ERROR_MESSAGE.invalidCredentials };
      }
      default: {
        return { isSuccess: false, errorMessage: AUTH_ERROR_MESSAGE.later };
      }
    }
  }

  public signOut(): void {
    this.removeConfidentialInfo();
    document.location.reload();
  }

  public getConfidentialInfo(): IUserTokens {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) as string) as IUserTokens;
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

  public async updateTokens(): Promise<void> {
    try {
      const userInfo: IUserTokens = this.getConfidentialInfo();
      const newTokens: ITokens = await this.api.updateToken(userInfo.userId, userInfo.refreshToken);
      userInfo.token = newTokens.token;
      userInfo.refreshToken = newTokens.refreshToken;
      this.saveConfidentialInfo(userInfo);
    } catch {
      this.signOut();
    }
  }

  public getAccessToken(): string {
    return this.getConfidentialInfo().token;
  }

  public getUserId(): string {
    return this.getConfidentialInfo().userId;
  }
}
