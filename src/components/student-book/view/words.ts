import WordsAPI from '../../../api/words-api';
import { BASE_URL } from '../../../constants';
import { Difficulty, IWord } from '../../../types';
import UIElementsConstructor from '../../../utils/ui-elements-creator';
import AuthController from '../../auth/auth-controller';

export default class WordCard {
  private elementCreator: UIElementsConstructor;

  readonly authController: AuthController;

  readonly wordsAPI: WordsAPI;

  readonly requestProcessor: RequestProcessor;

  private difficulty: 'easy' | 'hard';

  constructor(private word: IWord) {
    this.elementCreator = new UIElementsConstructor();
    this.authController = new AuthController();
    this.wordsAPI = new WordsAPI();
    this.requestProcessor = new RequestProcessor();
    this.difficulty = 'easy';
  }

  public createWordCard(): HTMLDivElement {
    const pageWords: HTMLDivElement = document.querySelector('.words') as HTMLDivElement;
    const wordContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['words__word-section'],
    });
    wordContainer.dataset.wordId = `${this.word.id}`;
    const infoContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['word-section__info'],
    });

    pageWords.append(wordContainer);
    wordContainer.append(this.createImage(`${BASE_URL}/${this.word.image}`), infoContainer);
    infoContainer.append(
      this.createWordTitle(),
      this.createControlsContainer(),
      this.createTextMeaningElement(),
      this.createTextExampleElement()
    );
    return wordContainer;
  }

  private createImage(imageUrl: string): HTMLDivElement {
    return this.elementCreator.createImage({
      classNames: ['word-section__img'],
      url: imageUrl,
    });
  }

  private createWordTitle(): HTMLDivElement {
    const titleContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['info__title-container'],
    });
    const title: HTMLHeadingElement = this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['info__title'],
      innerText: `${this.word.word} - ${this.word.wordTranslate} - ${this.word.transcription}`,
    });

    titleContainer.append(title);
    return titleContainer;
  }

  private createControlsContainer(): HTMLDivElement {
    const controlsButton: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['info__controls', 'controls'],
    });
    controlsButton.append(this.createLearnedWordButton(), this.createDifficultWordButton());
    return controlsButton;
  }

  private createTextMeaningElement(): HTMLDivElement {
    const textMeaningContainer: HTMLDivElement =
      this.elementCreator.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['info__text-meaning', 'text-meaning'],
      });

    const textMeaning: HTMLParagraphElement =
      this.elementCreator.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['text-meaning__native'],
        innerHTML: this.word.textMeaning,
      });

    const textMeaningTranslate: HTMLParagraphElement =
      this.elementCreator.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['text-meaning__translate'],
        innerHTML: this.word.textMeaningTranslate,
      });

    textMeaningContainer.append(textMeaning, textMeaningTranslate);

    return textMeaningContainer;
  }

  private createTextExampleElement(): HTMLDivElement {
    const textExampleContainer: HTMLDivElement =
      this.elementCreator.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['info__text-example', 'text-example'],
      });

    const textExample: HTMLParagraphElement =
      this.elementCreator.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['text-example__native'],
        innerHTML: this.word.textExample,
      });

    const textExampleTranslate: HTMLParagraphElement =
      this.elementCreator.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['text-example__translate'],
        innerHTML: this.word.textExampleTranslate,
      });

    textExampleContainer.append(textExample, textExampleTranslate);

    return textExampleContainer;
  }

  private createDifficultWordButton(): HTMLButtonElement {
    const buttonDifficult: HTMLButtonElement =
      this.elementCreator.createUIElement<HTMLButtonElement>({
        tag: 'button',
        classNames: ['controls__difficult-btn', 'difficult-btn'],
      });
    if (this.difficulty === 'hard') {
      buttonDifficult.classList.add('active');
      buttonDifficult.disabled = true;
    }
    buttonDifficult.addEventListener('click', async () => {});
    return buttonDifficult;
  }

  private disableDifficult = (btn: Difficulty): void => {
    const button = <HTMLButtonElement>(
      document.querySelector(`div[data-word-id = "${this.word.id}"] .${btn}-btn`)
    );

    button.classList.remove('active');
    button.removeAttribute('disabled');
  };

  private createLearnedWordButton(): HTMLButtonElement {
    const buttonLearned: HTMLButtonElement = this.elementCreator.createUIElement<HTMLButtonElement>(
      {
        tag: 'button',
        classNames: ['controls__learned-btn', 'learned-btn'],
      }
    );
    return buttonLearned;
  }

  private disableLearned = (btn: HTMLButtonElement): void => {
    const wordContainer: HTMLDivElement = document.querySelector(
      '.words__word-section'
    ) as HTMLDivElement;
    wordContainer.classList.remove('learned');

    btn.classList.remove('active');
    btn.removeAttribute('disabled');
  };
}
