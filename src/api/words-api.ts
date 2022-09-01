import { IWord, Numbers, HttpMethods, IRequestParameters, IAggregatedWord } from '../types';
import { BASE_URL, PATHS, QUERY_KEYS, REQUEST_HEADERS, MAX_WORDS_IN_BOOK } from '../constants';

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

  public async getDifficultWords({
    userId,
    token,
  }: IRequestParameters): Promise<IAggregatedWord[]> {
    const url = `${BASE_URL}/${PATHS.users}/${userId}/${PATHS.aggregatedWords}?${QUERY_KEYS.wordsPerPage}=${MAX_WORDS_IN_BOOK}&${QUERY_KEYS.filter}={"userWord.difficulty":"hard"}`;
    const response = await fetch(url, {
      method: HttpMethods.GET,
      headers: {
        [REQUEST_HEADERS.authorization]: `Bearer ${token}`,
        [REQUEST_HEADERS.accept]: 'application/json',
      },
    });
    const data = await response.json();
    const difficultWords = data[Numbers.Zero].paginatedResults;
    return difficultWords;
  }
}
