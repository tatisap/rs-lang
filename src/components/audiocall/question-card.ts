import { AUDIOCALL_AUDIO_BUTTON_PLACEMENT, AUDIOCALL_OPTIONS_NUMBER } from '../../constants';
import { IAudiocallQuestionInfo, Numbers } from '../../types';
import QuestionCardConstructor from './question-card-constructor';

export default class AudiocallQuestion {
  private uiConstructor: QuestionCardConstructor;

  private questionInfo: IAudiocallQuestionInfo;

  private container: HTMLDivElement;

  private answerElement: HTMLDivElement;

  private audioWrapper: HTMLDivElement;

  private audioElement: HTMLAudioElement;

  private optionsListElement: HTMLUListElement;

  private skipButton: HTMLButtonElement;

  constructor(questionInfo: IAudiocallQuestionInfo, questionNumber: number) {
    this.uiConstructor = new QuestionCardConstructor();
    this.container = this.uiConstructor.createContainer(questionNumber);
    this.audioWrapper = this.uiConstructor.createAudioWrapper(
      AUDIOCALL_AUDIO_BUTTON_PLACEMENT.inQuestion,
      questionInfo.correctAnswer.audioUrl
    );
    this.audioElement = this.audioWrapper.firstElementChild as HTMLAudioElement;
    this.optionsListElement = this.uiConstructor.createOptionList(questionInfo.answerOptions);
    this.answerElement = this.uiConstructor.createAnswer(questionInfo.correctAnswer);
    this.skipButton = this.uiConstructor.createSkipButton();
    this.questionInfo = questionInfo;
  }

  public makeQuestion(gameField: HTMLElement): void {
    this.addHandlersToElements();
    this.container.append(this.audioWrapper, this.optionsListElement, this.skipButton);
    gameField.append(this.container);
    this.playAudio();
  }

  private addHandlersToElements(): void {
    this.audioWrapper.addEventListener('click', async (): Promise<void> => {
      await this.playAudio();
    });
    this.audioElement.addEventListener('ended', () => this.disableSoundAnimation());
    this.optionsListElement.addEventListener('click', (event: MouseEvent): void =>
      this.userRawChoiceHandler(event)
    );
    this.skipButton.addEventListener('click', (): void => this.skipButtonHandler());

    const keyHandler = (event: KeyboardEvent): void => {
      event.preventDefault();
      switch (event.code) {
        case 'Space':
          this.playAudio();
          break;
        case 'Enter':
          this.skipButtonHandler();
          break;
        default:
          this.userRawChoiceHandler(event);
          break;
      }
    };

    document.addEventListener('keydown', keyHandler);
    this.container.addEventListener('question-closed', (): void =>
      document.removeEventListener('keydown', keyHandler)
    );
  }

  private async playAudio(): Promise<void> {
    this.enableSoundAnimation();
    await this.audioElement.play();
  }

  private enableSoundAnimation(): void {
    this.audioWrapper.classList.add('audio-wrapper_audio-playing');
  }

  private disableSoundAnimation(): void {
    this.audioWrapper.classList.remove('audio-wrapper_audio-playing');
  }

  private moveAudioWrapperToAnswer(): void {
    this.audioWrapper.classList.remove('question__audio-wrapper');
    this.audioWrapper.classList.add('answer__audio-wrapper');
    this.audioElement.classList.remove('question__audio');
    this.audioElement.classList.add('answer__audio');
    (this.answerElement.firstElementChild as HTMLDivElement).after(this.audioWrapper);
  }

  private openAnswer(): void {
    this.moveAudioWrapperToAnswer();
    this.container.prepend(this.answerElement);
    this.skipButton.classList.add('question__skip-button_answer-opened');
  }

  private skipButtonHandler(): void {
    if (this.skipButton.classList.contains('question__skip-button_answer-opened')) {
      this.container.dispatchEvent(new Event('question-closed', { bubbles: true }));
      return;
    }
    this.processUserChoice();
  }

  private processUserChoice(chosenOption?: HTMLLIElement): void {
    const options: HTMLLIElement[] = Array.from(
      this.optionsListElement.children
    ) as HTMLLIElement[];
    options.forEach((option: HTMLLIElement): void => {
      if (option === chosenOption) {
        option.classList.add('question__option_selected');
      } else {
        option.classList.add('question__option_unselected');
      }
      const optionValue: string = option.dataset.value as string;

      if (optionValue === this.questionInfo.correctAnswer.wordTranslation) {
        option.classList.add('question__option_correct');
      } else {
        option.classList.add('question__option_incorrect');
      }
    });

    if (chosenOption?.dataset.value === this.questionInfo.correctAnswer.wordTranslation) {
      (document.querySelector('.question') as HTMLDivElement).classList.add('question_correct');
    } else {
      (document.querySelector('.question') as HTMLDivElement).classList.add('question_incorrect');
    }
    this.openAnswer();
  }

  private userRawChoiceHandler(event: MouseEvent | KeyboardEvent): void {
    if (event.type === 'click') {
      const optionElement: HTMLLIElement = event.target as HTMLLIElement;
      if (!optionElement.classList.contains('question__option')) return;
      this.processUserChoice(optionElement);
    }
    if (event.type === 'keydown') {
      const chosenOptionNumber = Number((event as KeyboardEvent).key);

      if (
        Number.isNaN(chosenOptionNumber) ||
        chosenOptionNumber > AUDIOCALL_OPTIONS_NUMBER ||
        chosenOptionNumber < Numbers.One
      )
        return;

      this.processUserChoice(
        this.optionsListElement.children[chosenOptionNumber - Numbers.One] as HTMLLIElement
      );
    }
  }
}
