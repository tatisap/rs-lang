import { HttpMethods, IRequestParameters, IUserStatistics, StatusCode } from '../types';
import { BASE_URL, ERRORS_MESSAGES, PATHS, REQUEST_HEADERS } from '../constants';

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
    if (response.status === StatusCode.Unauthorized) {
      throw new Error(ERRORS_MESSAGES.unauthorized);
    }
    const statistics: IUserStatistics = (await response.json()) as IUserStatistics;
    return statistics;
  }

  public async updateUserStatistic({ userId, token, body }: IRequestParameters): Promise<void> {
    const response: Response = await fetch(
      `${BASE_URL}/${PATHS.users}/${userId}/${PATHS.statistics}`,
      {
        method: HttpMethods.PUT,
        headers: {
          [REQUEST_HEADERS.authorization]: `Bearer ${token}`,
          [REQUEST_HEADERS.accept]: 'application/json',
          [REQUEST_HEADERS.contentType]: 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    if (response.status === StatusCode.Unauthorized) {
      throw new Error(ERRORS_MESSAGES.unauthorized);
    }
  }
}
