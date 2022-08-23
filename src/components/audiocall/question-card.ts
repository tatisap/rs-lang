import { IAudiocallAnswerOption, IAudiocallQuestionInfo, Numbers } from '../../types';
import UIElementsConstructor from '../../utils/ui-elements-creator';

export default class AudiocallQuestionCard {
  private elementCreator: UIElementsConstructor;

  private questionInfo: IAudiocallQuestionInfo;

  constructor(questionInfo: IAudiocallQuestionInfo) {
    this.elementCreator = new UIElementsConstructor();
    this.questionInfo = questionInfo;
  }

  public makeQuestion(gameField: HTMLElement, questionHandler: (event: Event) => void): void {
    const questionContainer = this.createContainer();
    questionContainer.addEventListener('click', questionHandler);
    questionContainer.append(
      this.createAudio(),
      this.createAnswerContainer(),
      this.createOptionList(),
      this.createSkipButton()
    );
    gameField.append(questionContainer);
  }

  private createContainer(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['question'],
    });
  }

  private createAudio(): HTMLDivElement {
    const audioWrapper: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['question__audio-wrapper'],
    });
    const audio: HTMLAudioElement = this.elementCreator.createAudio({
      classNames: ['question__audio'],
      url: this.questionInfo.audioUrl,
    });
    audioWrapper.append(audio);
    audio.addEventListener('ended', () =>
      audioWrapper.classList.remove('question__audio-wrapper_audio-playing')
    );
    audioWrapper.addEventListener('click', this.audioHandler);
    return audioWrapper;
  }

  private createOption(option: IAudiocallAnswerOption, index: number): HTMLLIElement {
    return this.elementCreator.createUIElement<HTMLLIElement>({
      tag: 'li',
      classNames: ['question__option'],
      innerText: `${index + Numbers.One} ${option.value}`,
    });
  }

  private createOptionList(): HTMLUListElement {
    const optionList: HTMLUListElement = this.elementCreator.createUIElement<HTMLUListElement>({
      tag: 'ul',
      classNames: ['question__option-list'],
    });
    optionList.append(...this.questionInfo.answerOptions.map(this.createOption, this));
    return optionList;
  }

  private createAnswerContainer(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['question__answer', 'answer'],
    });
  }

  private createAnswerElements(): [HTMLDivElement, HTMLAudioElement, HTMLDivElement] {
    return [
      this.elementCreator.createImage({
        classNames: ['answer__image'],
        url: this.questionInfo.answerImageUrl,
      }),
      this.elementCreator.createAudio({
        classNames: ['answer__audio'],
        url: this.questionInfo.audioUrl,
      }),
      this.elementCreator.createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['answer__text'],
        innerText: this.questionInfo.answerOptions.find(
          (option: IAudiocallAnswerOption): boolean => option.isCorrect
        )?.value,
      }),
    ];
  }

  private createSkipButton(): HTMLButtonElement {
    return this.elementCreator.createUIElement<HTMLButtonElement>({
      tag: 'button',
      classNames: ['question__skip-button'],
    });
  }

  public async audioHandler(event: Event): Promise<void> {
    const audioWrapper: HTMLDivElement = event.target as HTMLDivElement;
    audioWrapper.classList.add('question__audio-wrapper_audio-playing');
    const audio: HTMLAudioElement = audioWrapper.querySelector(
      '.question__audio'
    ) as HTMLAudioElement;
    await audio.play();
  }
}
