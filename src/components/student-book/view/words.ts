import { BASE_URL } from '../../../constants';
import { IWord } from '../../../types';
import UIElementsConstructor from '../../../utils/ui-elements-creator';

export default class WordCard {
  private elementCreator: UIElementsConstructor;

  constructor(private word: IWord) {
    this.elementCreator = new UIElementsConstructor();
  }

  public createWordCard(): HTMLDivElement {
    const pageWords: HTMLDivElement = <HTMLDivElement>document.querySelector('.words');
    const wordContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['words__word-section'],
    });
    const infoContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['word-section__info'],
    });

    pageWords.append(wordContainer);
    wordContainer.append(this.createImage(`${BASE_URL}/${this.word.image}`), infoContainer);
    infoContainer.append(
      this.createWordTitle(),
      this.createTextMeaningElement(),
      this.createTextExampleElement()
    );
    return wordContainer;
  }

  private createImage(wordInfo: string): HTMLElement {
    return this.elementCreator.createImage({
      classNames: ['word-section__img'],
      url: wordInfo,
    });
  }

  private createWordTitle(): HTMLDivElement {
    const titleContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['info__title-container'],
    });
    const title: HTMLHeadElement = this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['info__title'],
      innerText: `${this.word.word} - ${this.word.wordTranslate} - ${this.word.transcription}`,
    });

    titleContainer.append(title, this.createAudio());
    return titleContainer;
  }

  private createAudio(): HTMLButtonElement {
    const audioBtn: HTMLButtonElement = this.elementCreator.createUIElement<HTMLButtonElement>({
      tag: 'button',
      classNames: ['link-icon__audio', 'audio'],
    });
    return audioBtn;
  }

  private createTextMeaningElement(): HTMLDivElement {
    const textMeaningContainer: HTMLDivElement =
      this.elementCreator.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['info__text-meaning'],
      });

    const textMeaning: HTMLElement = this.elementCreator.createUIElement<HTMLElement>({
      tag: 'p',
      classNames: ['text__meaning'],
      innerHTML: this.word.textMeaning,
    });

    const textMeaningTranslate: HTMLElement = this.elementCreator.createUIElement<HTMLElement>({
      tag: 'p',
      classNames: ['text__text-meaning-translate'],
      innerHTML: this.word.textMeaningTranslate,
    });

    textMeaningContainer.append(textMeaning, textMeaningTranslate);

    return textMeaningContainer;
  }

  private createTextExampleElement(): HTMLDivElement {
    const textExampleContainer: HTMLDivElement =
      this.elementCreator.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['info__text-example'],
      });

    const textExample: HTMLElement = this.elementCreator.createUIElement<HTMLElement>({
      tag: 'p',
      classNames: ['text__example'],
      innerHTML: this.word.textExample,
    });

    const textExampleTranslate: HTMLElement = this.elementCreator.createUIElement<HTMLElement>({
      tag: 'p',
      classNames: ['text__example-translate'],
      innerHTML: this.word.textExampleTranslate,
    });

    textExampleContainer.append(textExample, textExampleTranslate);

    return textExampleContainer;
  }
}
