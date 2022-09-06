import UIElementsConstructor from '../../../../utils/ui-elements-creator';
import { ISprintQuestionInfo, KeyboardCode } from '../../../../types';
import AnswerProcessor from '../answer-processor';

export default class QuestionCardConstructor {
  private elementConstructor: UIElementsConstructor;

  private answerProcessor: AnswerProcessor;

  constructor() {
    this.elementConstructor = new UIElementsConstructor();
    this.answerProcessor = new AnswerProcessor();
  }

  public createQuestionCardWraper(
    questionInfo: ISprintQuestionInfo,
    questionNumber: number,
    parentContainer: HTMLDivElement
  ): void {
    const questionCard: HTMLDivElement = this.elementConstructor.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['game-card__question-card', 'question-card'],
    });
    questionCard.dataset.questionNumber = `${questionNumber}`;
    const word: HTMLParagraphElement =
      this.elementConstructor.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['question-card__word'],
        innerText: questionInfo.correctAnswer.word,
      });
    const answer: HTMLParagraphElement =
      this.elementConstructor.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['question-card__answer'],
        innerText: questionInfo.answerOption.wordTranslation,
      });
    questionCard.append(word, answer);
    this.addHandlersToElements(questionInfo);
    parentContainer.append(questionCard);
  }

  private addHandlersToElements(questionInfo: ISprintQuestionInfo): void {
    (document.querySelector('.buttons__correct') as HTMLButtonElement).addEventListener(
      'click',
      async (event: MouseEvent): Promise<void> => {
        await this.answerProcessor.init(questionInfo, event);
      }
    );
    (document.querySelector('.buttons__incorrect') as HTMLButtonElement).addEventListener(
      'click',
      async (event: MouseEvent): Promise<void> => {
        await this.answerProcessor.init(questionInfo, event);
      }
    );

    const keyHandler = async (event: KeyboardEvent): Promise<void> => {
      event.preventDefault();
      switch (event.code) {
        case KeyboardCode.ArrowLeft:
        case KeyboardCode.ArrowRight:
          await this.answerProcessor.init(questionInfo, event);
          break;
        default:
          break;
      }
    };

    const removeKeyHandler = (): void => {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('new-page-opened', removeKeyHandler);
    };

    document.addEventListener('keydown', keyHandler);
    document.addEventListener('new-page-opened', removeKeyHandler);
    (document.querySelector('.game.sprint') as HTMLDivElement).addEventListener(
      'question-answered',
      removeKeyHandler
    );
  }
}
