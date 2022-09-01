import { HttpMethods, IRequestParameters, IUserStatistics } from '../types';
import { BASE_URL, PATHS, REQUEST_HEADERS } from '../constants';

export default class StatisticAPI {
  public async getUserStatistic({ userId, token }: IRequestParameters): Promise<IUserStatistics> {
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
    const statistics: IUserStatistics = (await response.json()) as IUserStatistics;
    return statistics;
  }
}
