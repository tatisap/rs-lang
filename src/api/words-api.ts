import { HttpMethods, IStatistics, IUserWord, IWord, Numbers } from '../types';
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

  public async getUserWords(userId: string, token: string): Promise<IUserWord[]> {
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

  public async getUserStatistic(userId: string, token: string): Promise<IStatistics> {
    const response: Response = await fetch(
      `${BASE_URL}/${PATHS.users}/${userId}/${PATHS.statistics}`,
      {
        method: HttpMethods.GET,
        headers: {
          [REQUEST_HEADERS.authorization]: `Bearer ${token}`,
          [REQUEST_HEADERS.accept]: 'application/json',
        },
      }
    );
    const statistics: IStatistics = (await response.json()) as IStatistics;
    return statistics;
  }
}
