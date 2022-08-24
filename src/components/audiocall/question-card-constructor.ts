import { IAudiocallAnswerOption, IAudiocallCorrectAnswer, Numbers } from '../../types';
import UIElementsConstructor from '../../utils/ui-elements-creator';

export default class QuestionCardConstructor {
  private elementCreator: UIElementsConstructor;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
  }

  public createContainer(questionNumber: number): HTMLDivElement {
    const questionContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['question'],
    });
    questionContainer.dataset.questionNumber = `${questionNumber}`;
    return questionContainer;
  }

  public createAudioWrapper(placement: string, audioUrl: string): HTMLDivElement {
    const audioWrapper: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: [`${placement}__audio-wrapper`, 'audio-wrapper'],
    });
    const audio: HTMLAudioElement = this.elementCreator.createAudio({
      classNames: [`${placement}__audio`, 'audio'],
      url: audioUrl,
    });
    audioWrapper.append(audio);
    return audioWrapper;
  }

  public createOption(option: IAudiocallAnswerOption, index: number): HTMLLIElement {
    const optionElement: HTMLLIElement = this.elementCreator.createUIElement<HTMLLIElement>({
      tag: 'li',
      classNames: ['question__option'],
      innerText: `${index + Numbers.One} ${option.wordTranslation}`,
    });
    optionElement.dataset.value = option.wordTranslation;
    return optionElement;
  }

  public createOptionList(answerOptions: IAudiocallAnswerOption[]): HTMLUListElement {
    const optionList: HTMLUListElement = this.elementCreator.createUIElement<HTMLUListElement>({
      tag: 'ul',
      classNames: ['question__option-list'],
    });
    optionList.append(...answerOptions.map(this.createOption, this));
    return optionList;
  }

  public createAnswer(answerInfo: IAudiocallCorrectAnswer): HTMLDivElement {
    const answerContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['question__answer', 'answer'],
    });
    answerContainer.append(
      this.elementCreator.createImage({
        classNames: ['answer__image'],
        url: answerInfo.imageUrl,
      }),
      this.elementCreator.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['answer__text'],
        innerText: answerInfo.word,
      })
    );
    return answerContainer;
  }

  public createSkipButton(): HTMLButtonElement {
    return this.elementCreator.createUIElement<HTMLButtonElement>({
      tag: 'button',
      classNames: ['question__skip-button'],
    });
  }
}
