import { NO_CONTENT } from '../../constants';
import { IAudiocallQuestionInfo, Numbers } from '../../types';
import UIElementsConstructor from '../../utils/ui-elements-creator';
import AudiocallController from './audiocall-controller';
import AudiocallQuestion from './question-card';

export default class AudioCallView {
  private elementCreator: UIElementsConstructor;

  private container: HTMLDivElement;

  private controller: AudiocallController;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.controller = new AudiocallController();
    this.container = this.createGameContainer();
  }

  public async start(): Promise<void> {
    this.openGameContainer();
    const questionInfoList: IAudiocallQuestionInfo[] = await this.controller.getQuestionList(1, 29);
    new AudiocallQuestion(questionInfoList[0], 0).makeQuestion(this.container);
    this.container.addEventListener('question-closed', (): void => {
      const nextQuestionNumber: number =
        Number(
          (this.container.firstElementChild as HTMLDivElement).dataset.questionNumber as string
        ) + Numbers.One;
      this.clearGameContainer();
      new AudiocallQuestion(questionInfoList[nextQuestionNumber], nextQuestionNumber).makeQuestion(
        this.container
      );
    });
  }

  private createGameContainer(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['game', 'audiocall'],
    });
  }

  private openGameContainer(): void {
    this.clearGameContainer();
    (document.querySelector('.page_games') as HTMLElement).append(this.container);
  }

  private clearGameContainer(): void {
    this.container.innerHTML = NO_CONTENT;
  }

  private closeGameContainer(): void {
    this.container.remove();
  }
}
