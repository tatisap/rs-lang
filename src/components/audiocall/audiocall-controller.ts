import WordsAPI from '../../api/words-api';
import {
  AUDIOCALL_INCORRECT_ANSWERS_NUMBER,
  BASE_URL,
  MAX_PAGES_IN_BOOK_SECTION,
} from '../../constants';
import { IAudiocallAnswerOption, IAudiocallQuestionInfo, IWord } from '../../types';
import Randomizer from '../../utils/randomizer';

export default class AudiocallController {
  private api: WordsAPI;

  private randomizer: Randomizer;

  constructor() {
    this.api = new WordsAPI();
    this.randomizer = new Randomizer();
  }

  public async getQuestionList(
    level: number,
    levelPage = this.randomizer.getRandomIntegerFromOneToMax(MAX_PAGES_IN_BOOK_SECTION)
  ): Promise<IAudiocallQuestionInfo[]> {
    const wordList: IWord[] = this.randomizer.shuffle<IWord>(
      await this.api.getWords(level, levelPage)
    );

    return wordList.map(
      (questionWordInfo: IWord): IAudiocallQuestionInfo =>
        this.createQuestionInfo(questionWordInfo, wordList)
    );
  }

  private createQuestionInfo(
    questionWordInfo: IWord,
    wordsInfoArray: IWord[]
  ): IAudiocallQuestionInfo {
    const wordsForAnswerOptions: IWord[] = this.randomizer.shuffle([
      questionWordInfo,
      ...this.randomizer.getRandomItemsFromArray(
        wordsInfoArray.filter((wordInfo: IWord): boolean => questionWordInfo !== wordInfo),
        AUDIOCALL_INCORRECT_ANSWERS_NUMBER
      ),
    ]);
    return {
      correctAnswer: {
        audioUrl: `${BASE_URL}/${questionWordInfo.audio}`,
        imageUrl: `${BASE_URL}/${questionWordInfo.image}`,
        word: questionWordInfo.word,
      },
      answerOptions: wordsForAnswerOptions.map((wordInfo: IWord): IAudiocallAnswerOption => {
        return {
          wordTranslation: wordInfo.wordTranslate,
          isCorrect: wordInfo.word === questionWordInfo.word,
        };
      }),
    };
  }
}
