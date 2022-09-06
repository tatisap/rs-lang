import { BASE_URL, PATHS, REQUEST_HEADERS } from '../constants';
import {
  HttpMethods,
  IResponse,
  ISignUpError,
  ITokens,
  IUser,
  IUserTokens,
  StatusCode,
} from '../types';

export default class UserAPI {
  public async createUser(user: IUser): Promise<IResponse> {
    const response: Response = await fetch(`${BASE_URL}/${PATHS.users}`, {
      method: HttpMethods.POST,
      headers: {
        [REQUEST_HEADERS.contentType]: 'application/json',
        [REQUEST_HEADERS.accept]: 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.status === StatusCode.Ok || response.status === StatusCode.UnprocessableEntity) {
      return {
        statusCode: response.status,
        content: (await response.json()) as IUser | ISignUpError,
      };
    }
    return { statusCode: response.status };
  }

  public async signIn(credentials: Omit<IUser, 'name'>): Promise<IResponse> {
    const response: Response = await fetch(`${BASE_URL}/${PATHS.signIn}`, {
      method: HttpMethods.POST,
      headers: {
        [REQUEST_HEADERS.contentType]: 'application/json',
        [REQUEST_HEADERS.accept]: 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.status === StatusCode.Ok) {
      return {
        statusCode: response.status,
        content: (await response.json()) as IUserTokens,
      };
    }
    return { statusCode: response.status };
  }

  public async updateToken(userId: string, refreshToken: string): Promise<ITokens> {
    const response: Response = await fetch(`${BASE_URL}/${PATHS.users}/${userId}/${PATHS.tokens}`, {
      method: HttpMethods.GET,
      headers: {
        [REQUEST_HEADERS.authorization]: `Bearer ${refreshToken}`,
        [REQUEST_HEADERS.accept]: 'application/json',
      },
    });
    const tokens: ITokens = (await response.json()) as ITokens;
    return tokens;
  }
}
