import { HttpMethods, IRequestParameters, IUserWord, IWord, Numbers } from '../types';
import { BASE_URL, PATHS, QUERY_KEYS, REQUEST_HEADERS } from '../constants';

export default class WordsAPI {
  public async getWords(group: number, page: number): Promise<IWord[]> {
    const url = `${BASE_URL}/${PATHS.words}?${QUERY_KEYS.group}=${group}&${QUERY_KEYS.page}=${
      page - Numbers.One
    }`;
    const response = await fetch(url);
    const data: IWord[] = await response.json();
    return data;
  }

  public async getWord(id: string): Promise<IWord> {
    const response: Response = await fetch(`${BASE_URL}/${PATHS.words}/${id}`);
    const data: IWord = await response.json();
    return data;
  }

  public async getUserWords({ userId, token }: IRequestParameters): Promise<IUserWord[]> {
    const url = `${BASE_URL}/${PATHS.users}/${userId}/${PATHS.words}`;
    const response: Response = await fetch(url, {
      method: HttpMethods.GET,
      headers: {
        [REQUEST_HEADERS.authorization]: `Bearer ${token}`,
        [REQUEST_HEADERS.accept]: 'application/json',
      },
    });
    const data: IUserWord[] = (await response.json()) as IUserWord[];
    return data;
  }

  public async getUserWord({ userId, token, wordId }: IRequestParameters): Promise<IUserWord> {
    const url = `${BASE_URL}/${PATHS.users}/${userId}/${PATHS.words}/${wordId}`;
    const response: Response = await fetch(url, {
      method: HttpMethods.GET,
      headers: {
        [REQUEST_HEADERS.authorization]: `Bearer ${token}`,
        [REQUEST_HEADERS.accept]: 'application/json',
      },
    });
    const data: IUserWord = (await response.json()) as IUserWord;
    return data;
  }

  public async createUserWord({ userId, token, wordId, body }: IRequestParameters): Promise<void> {
    const url = `${BASE_URL}/${PATHS.users}/${userId}/${PATHS.words}/${wordId}`;
    await fetch(url, {
      method: HttpMethods.POST,
      headers: {
        [REQUEST_HEADERS.authorization]: `Bearer ${token}`,
        [REQUEST_HEADERS.contentType]: 'application/json',
        [REQUEST_HEADERS.accept]: 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  public async updateUserWord({ userId, token, wordId, body }: IRequestParameters): Promise<void> {
    const url = `${BASE_URL}/${PATHS.users}/${userId}/${PATHS.words}/${wordId}`;
    await fetch(url, {
      method: HttpMethods.PUT,
      headers: {
        [REQUEST_HEADERS.authorization]: `Bearer ${token}`,
        [REQUEST_HEADERS.contentType]: 'application/json',
        [REQUEST_HEADERS.accept]: 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}
