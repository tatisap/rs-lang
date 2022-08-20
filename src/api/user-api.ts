import { BASE_URL, PATHS, REQUEST_HEADERS } from '../constants';
import { HttpMethods, IResponse, IUser, IUserTokens } from '../types';

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
    const content: IUser = (await response.json()) as IUser;
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
    const content: IUserTokens = (await response.json()) as IUserTokens;
    return { statusCode: response.status, content };
  }
}
