import {
  AUDIOCALL_AUDIO_BUTTON_PLACEMENT,
  AUDIOCALL_ANSWER_OPTIONS_NUMBER,
} from '../../../../constants';
import {
  IAudiocallQuestionInfo,
  IGameQuestionResult,
  KeyboardCode,
  Numbers,
} from '../../../../types';
import AudioElement from '../../../audio/audio-element';
import QuestionCardConstructor from './card-constructor';

export default class AudiocallQuestion {
  private uiConstructor: QuestionCardConstructor;

  private questionInfo: IAudiocallQuestionInfo;

  private container: HTMLDivElement;

  private answerElement: HTMLDivElement;

  private audioElement: AudioElement;

  private optionsListElement: HTMLUListElement;

  private skipButton: HTMLButtonElement;

  constructor(questionInfo: IAudiocallQuestionInfo, questionNumber: number) {
    this.uiConstructor = new QuestionCardConstructor();
    this.container = this.uiConstructor.createContainer(questionNumber);
    this.audioElement = new AudioElement([questionInfo.correctAnswer.audioUrl]);
    this.optionsListElement = this.uiConstructor.createOptionList(questionInfo.answerOptions);
    this.answerElement = this.uiConstructor.createAnswer(questionInfo.correctAnswer);
    this.skipButton = this.uiConstructor.createSkipButton();
    this.questionInfo = questionInfo;
  }

  public makeQuestion(gameField: HTMLElement): void {
    this.audioElement.init().addClassWithModifier(AUDIOCALL_AUDIO_BUTTON_PLACEMENT.inQuestion);
    this.addHandlersToElements();
    this.container.append(
      this.audioElement.getAudioElement(),
      this.optionsListElement,
      this.skipButton
    );
    gameField.append(this.container);
    this.audioElement.play();
  }

  private addHandlersToElements(): void {
    this.optionsListElement.addEventListener('click', (event: MouseEvent): void =>
      this.userRawChoiceHandler(event)
    );
    this.skipButton.addEventListener('click', (): void => this.skipButtonHandler());

    const keyHandler = (event: KeyboardEvent): void => {
      event.preventDefault();
      switch (event.code) {
        case KeyboardCode.Space:
          this.audioElement.play();
          break;
        case KeyboardCode.Enter:
          this.skipButtonHandler();
          break;
        default:
          this.userRawChoiceHandler(event);
          break;
      }
    };

    const removeKeyHandler = (): void => {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('new-page-opened', removeKeyHandler);
    };

    document.addEventListener('keydown', keyHandler);
    document.addEventListener('new-page-opened', removeKeyHandler);
    this.container.addEventListener('question-closed', removeKeyHandler);
  }

  private moveAudioWrapperToAnswer(): void {
    this.audioElement.removeClassWithModifier(AUDIOCALL_AUDIO_BUTTON_PLACEMENT.inQuestion);
    this.audioElement.addClassWithModifier(AUDIOCALL_AUDIO_BUTTON_PLACEMENT.inAnswer);
    (this.answerElement.firstElementChild as HTMLDivElement).after(
      this.audioElement.getAudioElement()
    );
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
    if (this.skipButton.classList.contains('question__skip-button_answer-opened')) return;
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

    const isUserAnswerCorrect: boolean =
      chosenOption?.dataset.value === this.questionInfo.correctAnswer.wordTranslation;
    this.container.dataset.isUserAnswerCorrect = `${isUserAnswerCorrect}`;
    this.container.dispatchEvent(
      new CustomEvent('question-answered', {
        bubbles: true,
        detail: {
          isCorrect: isUserAnswerCorrect,
          correctAnswer: this.questionInfo.correctAnswer,
        } as IGameQuestionResult,
      })
    );

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
        chosenOptionNumber > AUDIOCALL_ANSWER_OPTIONS_NUMBER ||
        chosenOptionNumber < Numbers.One
      )
        return;

      this.processUserChoice(
        this.optionsListElement.children[chosenOptionNumber - Numbers.One] as HTMLLIElement
      );
    }
  }
}
