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
    const infoContainer: HTMLElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['word-section__info'],
    });

    wordContainer.append(this.createImage(), infoContainer);
    infoContainer.append(
      this.createWordTitle(),
      this.createTextMeaningElement(),
      this.createTextExampleElement()
    );
    return wordContainer;
  }

  private createImage(): HTMLElement {
    const imageContainer: HTMLElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['word-section__img'],
    });

    const image: HTMLImageElement = new Image();
    image.src = `${BASE_URL}/${this.word.image}`;
    image.onload = () => {
      imageContainer.style.backgroundImage = `url(${image.src})`;
    };

    return imageContainer;
  }

  private createWordTitle(): HTMLElement {
    const title: HTMLElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['info__title'],
    });

    const word: HTMLElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'h3',
      classNames: ['title__word'],
      innerText: this.word.word,
    });
    const wordTranslate: HTMLElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'h3',
      classNames: ['title-translate'],
      innerText: this.word.wordTranslate,
    });
    const wordTranscription: HTMLElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'h3',
      classNames: ['title-transcription'],
      innerText: this.word.transcription,
    });

    title.append(word, wordTranslate, wordTranscription, this.createIcon());
    return title;
  }

  private createIcon(): HTMLElement {
    const iconContainer = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['title__link-icon'],
    });
    const audioBtn = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'button',
      classNames: ['link-icon__audio', 'audio'],
    });
    const deleteBtn = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'button',
      classNames: ['link-icon__delete', 'delete'],
    });
    const hardBtn = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'button',
      classNames: ['link-icon__hard', 'hard'],
    });

    iconContainer.append(audioBtn, deleteBtn, hardBtn);

    return iconContainer;
  }

  private createTextMeaningElement(): HTMLElement {
    const textMeaningContainer: HTMLElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['info__text-meaning'],
    });

    const textMeaning: HTMLElement = this.elementCreator.createUIElement<HTMLElement>({
      tag: 'p',
      classNames: ['text__meaning'],
      innerText: this.word.textMeaning,
    });

    const textMeaningTranslate: HTMLElement = this.elementCreator.createUIElement<HTMLElement>({
      tag: 'p',
      classNames: ['text__text-meaning-translate'],
      innerText: this.word.textMeaningTranslate,
    });

    textMeaningContainer.append(textMeaning, textMeaningTranslate);

    return textMeaningContainer;
  }

  private createTextExampleElement(): HTMLElement {
    const textExampleContainer: HTMLElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['info__text-example'],
    });

    const textExample: HTMLElement = this.elementCreator.createUIElement<HTMLElement>({
      tag: 'p',
      classNames: ['text__example'],
      innerText: this.word.textExample,
    });

    const textExampleTranslate: HTMLElement = this.elementCreator.createUIElement<HTMLElement>({
      tag: 'p',
      classNames: ['text__example-translate'],
      innerText: this.word.textExampleTranslate,
    });

    textExampleContainer.append(textExample, textExampleTranslate);

    return textExampleContainer;
  }
}
