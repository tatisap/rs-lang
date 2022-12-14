import WordsAPI from '../../../api/words-api';
import { BASE_URL, DIFFICULT_WORDS_CONTAINER_MESSAGES, NO_CONTENT } from '../../../constants';
import { IWord, IAggregatedWord, IUserWord, Numbers } from '../../../types';
import DateFormatter from '../../../utils/date-formatter';
import UIElementsConstructor from '../../../utils/ui-elements-creator';
import AudioElement from '../../audio/audio-element';
import AuthController from '../../auth/auth-controller';
import RequestProcessor from '../../request-processor';
import UserWord from '../../user-word';
import StudentBookController from '../controller';
import WordProgressModal from './progress-modal';

export default class WordCard {
  private elementCreator: UIElementsConstructor;

  readonly authController: AuthController;

  readonly wordsAPI: WordsAPI;

  readonly requestProcessor: RequestProcessor;

  private dateFormatter: DateFormatter;

  private container: HTMLDivElement;

  private studentBookController: StudentBookController;

  constructor(private word: IWord | IAggregatedWord) {
    this.elementCreator = new UIElementsConstructor();
    this.authController = new AuthController();
    this.wordsAPI = new WordsAPI();
    this.requestProcessor = new RequestProcessor();
    this.dateFormatter = new DateFormatter();
    this.container = this.createWordCardContainer();
    this.studentBookController = new StudentBookController();
  }

  public createWordCard(): HTMLDivElement {
    this.container.dataset.wordId = `${
      (this.word as IWord).id || (this.word as IAggregatedWord)._id
    }`;
    const infoContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['word-section__info'],
    });
    this.container.append(this.createImage(`${BASE_URL}/${this.word.image}`), infoContainer);
    infoContainer.append(
      this.createWordTitle(),
      this.createControlsContainer(),
      this.createTextMeaningElement(),
      this.createTextExampleElement()
    );
    return this.container;
  }

  private createWordCardContainer(): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['words__word-section'],
    });
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

    const audio: AudioElement = new AudioElement([
      `${BASE_URL}/${this.word.audio}`,
      `${BASE_URL}/${this.word.audioMeaning}`,
      `${BASE_URL}/${this.word.audioExample}`,
    ]);
    audio.init().addClassWithModifier('word-card');
    controlsButton.append(audio.getAudioElement());

    if (this.authController.isUserAuthorized()) {
      controlsButton.append(
        this.createLearnedWordButton(),
        (document.querySelector('.superhero') as HTMLElement).classList.contains('active')
          ? this.createEasyWordButton()
          : this.createDifficultWordButton(),
        this.createProgressButton()
      );
    }

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

    buttonDifficult.addEventListener('click', async () => {
      if (!buttonDifficult.classList.contains('difficult-btn__active')) {
        const userWords: IUserWord[] = await this.requestProcessor.process<IUserWord[]>(
          this.wordsAPI.getUserWords
        );
        const userWordInfo: IUserWord | undefined = userWords.find(
          (word: IUserWord): boolean =>
            word.wordId === ((this.word as IWord).id || (this.word as IAggregatedWord)._id)
        );
        const userWord: UserWord = new UserWord();
        if (userWordInfo) {
          userWord.update(userWordInfo);
          userWord.markAsHard(Date.now());
          userWord.resetCorrectAnswersInRow();
          userWord.removeLearnedMark();
          await this.requestProcessor.process<void>(this.wordsAPI.updateUserWord, {
            wordId: (this.word as IWord).id,
            body: userWord.getUserWordInfo(),
          });
        } else {
          userWord.markAsHard(Date.now());
          userWord.removeLearnedMark();
          await this.requestProcessor.process<void>(this.wordsAPI.createUserWord, {
            wordId: (this.word as IWord).id,
            body: userWord.getUserWordInfo(),
          });
        }
        buttonDifficult.classList.add('difficult-btn__active');
        const learnedWordButton = <HTMLButtonElement>this.container.querySelector('.learned-btn');
        learnedWordButton.classList.remove('learned-btn_active');
      }
      this.checkPageLearningStatus();
    });
    return buttonDifficult;
  }

  private disableButton(buttonType: string): void {
    const button = <HTMLButtonElement>this.container.querySelector(`.${buttonType}-btn`);
    button.setAttribute('disabled', NO_CONTENT);
  }

  private removeDisabledButton(buttonType: string): void {
    const button = <HTMLButtonElement>this.container.querySelector(`.${buttonType}-btn`);
    button.removeAttribute('disabled');
  }

  private createLearnedWordButton(): HTMLButtonElement {
    const buttonLearned: HTMLButtonElement = this.elementCreator.createUIElement<HTMLButtonElement>(
      {
        tag: 'button',
        classNames: ['controls__learned-btn', 'learned-btn'],
      }
    );

    buttonLearned.addEventListener('click', async () => {
      if (!buttonLearned.classList.contains('learned-btn__active')) {
        const todayDateKey: string = this.dateFormatter.getStringifiedDateKey(new Date());
        const userWords: IUserWord[] = await this.requestProcessor.process<IUserWord[]>(
          this.wordsAPI.getUserWords
        );
        const userWordInfo: IUserWord | undefined = userWords.find(
          (word: IUserWord): boolean =>
            word.wordId === ((this.word as IWord).id || (this.word as IAggregatedWord)._id)
        );
        const userWord: UserWord = new UserWord();

        if (userWordInfo) {
          userWord.update(userWordInfo);
          userWord.markAsLearned(todayDateKey);
          userWord.markAsEasy();
          await this.requestProcessor.process<void>(this.wordsAPI.updateUserWord, {
            wordId: (this.word as IWord).id || (this.word as IAggregatedWord)._id,
            body: userWord.getUserWordInfo(),
          });
        } else {
          userWord.markAsLearned(todayDateKey);
          userWord.markAsEasy();
          await this.requestProcessor.process<void>(this.wordsAPI.createUserWord, {
            wordId: (this.word as IWord).id || (this.word as IAggregatedWord)._id,
            body: userWord.getUserWordInfo(),
          });
        }

        if ((document.querySelector('.superhero') as HTMLElement).classList.contains('active')) {
          this.container.remove();
          this.checkDifficultWordsContainer();
          return;
        }

        buttonLearned.classList.add('learned-btn__active');
        const difficultButton = <HTMLButtonElement>this.container.querySelector(`.difficult-btn`);
        difficultButton.classList.remove('difficult-btn__active');
        this.disableButton('difficult');
      } else {
        const userWordInfo: IUserWord = await this.requestProcessor.process<IUserWord>(
          this.wordsAPI.getUserWord,
          { wordId: (this.word as IWord).id }
        );
        const userWord: UserWord = new UserWord().update(userWordInfo);
        userWord.removeLearnedMark();
        userWord.resetCorrectAnswersInRow();
        await this.requestProcessor.process<void>(this.wordsAPI.updateUserWord, {
          wordId: (this.word as IWord).id,
          body: userWord.getUserWordInfo(),
        });
        buttonLearned.classList.remove('learned-btn__active');
        this.removeDisabledButton('difficult');
      }
      this.checkPageLearningStatus();
    });
    return buttonLearned;
  }

  private createEasyWordButton(): HTMLButtonElement {
    const buttonEasy: HTMLButtonElement = this.elementCreator.createUIElement<HTMLButtonElement>({
      tag: 'button',
      classNames: ['controls__easy-btn', 'easy-btn'],
    });

    buttonEasy.addEventListener('click', async () => {
      const userWordInfo: IUserWord = await this.requestProcessor.process<IUserWord>(
        this.wordsAPI.getUserWord,
        {
          wordId: (this.word as IAggregatedWord)._id,
        }
      );

      const userWord: UserWord = new UserWord().update(userWordInfo);
      userWord.markAsEasy();
      userWord.resetCorrectAnswersInRow();

      await this.requestProcessor.process<void>(this.wordsAPI.updateUserWord, {
        wordId: (this.word as IAggregatedWord)._id,
        body: userWord.getUserWordInfo(),
      });
      this.container.remove();
      this.checkDifficultWordsContainer();
    });
    return buttonEasy;
  }

  private createProgressButton(): HTMLButtonElement {
    const progressButton: HTMLButtonElement =
      this.elementCreator.createUIElement<HTMLButtonElement>({
        tag: 'button',
        classNames: ['controls__progress-button'],
      });
    progressButton.addEventListener('click', async (event: Event): Promise<void> => {
      const { wordId } = (
        (event.target as HTMLButtonElement).closest('.words__word-section') as HTMLDivElement
      ).dataset;
      new WordProgressModal().open(wordId as string);
    });
    return progressButton;
  }

  private checkDifficultWordsContainer(): void {
    const wordCardsContainer: HTMLDivElement = document.querySelector(
      '.page__words.words.difficult-words'
    ) as HTMLDivElement;
    if (wordCardsContainer?.children?.length === Numbers.Zero) {
      wordCardsContainer.textContent = DIFFICULT_WORDS_CONTAINER_MESSAGES.noWords;
      this.studentBookController.disableGameLinks();
    }
  }

  private checkPageLearningStatus(): void {
    const wordCards: HTMLDivElement[] = Array.from(
      document.querySelectorAll('.words__word-section') as NodeListOf<HTMLDivElement>
    );

    const isPageLearned: boolean = wordCards.every((wordCard: HTMLDivElement): boolean => {
      const learnedButton = wordCard.querySelector('.learned-btn') as HTMLButtonElement;
      const difficultButton = wordCard.querySelector('.difficult-btn') as HTMLButtonElement;
      return (
        learnedButton.classList.contains('learned-btn__active') ||
        difficultButton.classList.contains('difficult-btn__active')
      );
    });

    const wordsContainer = document.querySelector('.words') as HTMLDivElement;
    const pageNumberElement = document.querySelector('.pagination__current-page') as HTMLDivElement;

    if (isPageLearned) {
      wordsContainer.classList.add('words_all-words-learned');
      pageNumberElement.classList.add('current-page_all-words-learned');
      new StudentBookController().disableGameLinks();
    } else {
      wordsContainer.classList.remove('words_all-words-learned');
      pageNumberElement.classList.remove('current-page_all-words-learned');
      new StudentBookController().enableGameLinks();
    }
  }
}
