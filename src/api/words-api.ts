import { IWord } from '../types';
import { BASE_URL, PATHS, QUERY_KEYS } from '../constants';

export default class WordsAPI {
  public async getWords(group: number, page: number): Promise<IWord[]> {
    const url = `${BASE_URL}/${PATHS.words}?${QUERY_KEYS.group}=${group}&${QUERY_KEYS.page}=${page}`;
    const response = await fetch(url);
    const data: IWord[] = await response.json();
    return data;
  }
}
