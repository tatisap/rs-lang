import { BASE_URL } from '../../../constants';
import { IWord } from '../../../types';
import UIElementsConstructor from '../../../utils/ui-elements-creator';

export default class WordCard {
  private elementCreator: UIElementsConstructor;

  constructor(private word: IWord) {
    this.elementCreator = new UIElementsConstructor();
  }

  public createWordCard(): HTMLDivElement {
    const wordContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['words__word-section'],
    });
    wordContainer.dataset.wordId = `${this.word.id}`;
    const infoContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['word-section__info'],
    });
    wordContainer.append(this.createImage(`${BASE_URL}/${this.word.image}`), infoContainer);
    infoContainer.append(
      this.createWordTitle(),
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

    titleContainer.append(title, this.createControlsContainer());
    return titleContainer;
  }

  private createControlsContainer(): HTMLDivElement {
    const controlsButton: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['info__controls', 'controls'],
    });
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
}
