import { BASE_URL, PATHS, REQUEST_HEADERS } from '../constants';
import { HttpMethods, IResponse, ISignUpError, IUser, IUserTokens, StatusCode } from '../types';

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
    let content: IUser | ISignUpError | string;
    if (response.status === StatusCode.Ok || response.status === StatusCode.UnprocessableEntity) {
      content = (await response.json()) as IUser | ISignUpError;
    } else {
      content = await response.text();
    }
    return { statusCode: response.status, content };
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
    let content: IUserTokens | string;
    if (response.status === StatusCode.Ok) {
      content = (await response.json()) as IUserTokens;
    } else {
      content = await response.text();
    }
    return { statusCode: response.status, content };
  }
}
