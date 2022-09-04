import UIElementsConstructor from '../../../utils/ui-elements-creator';
import {
  PAGE_TITLES,
  GAMES,
  BOOK_SECTIONS,
  PAGINATION_BUTTONS,
  MAX_PAGES_IN_BOOK_SECTION,
  DISPLAY_MODES,
  NO_CONTENT,
  DIFFICULT_WORDS_CONTAINER_MESSAGES,
} from '../../../constants';
import { IBookSectionInfo, Numbers, IWord, IAggregatedWord } from '../../../types';
import StudentBookController from '../controller';
import WordCard from './words';
import WordsAPI from '../../../api/words-api';
import AuthController from '../../auth/auth-controller';
import RequestProcessor from '../../request-processor';
import GameSwitcher from '../../games/game-switcher';

export default class StudentBookView {
  readonly elementCreator: UIElementsConstructor;

  readonly bookController: StudentBookController;

  readonly authController: AuthController;

  readonly wordsAPI: WordsAPI;

  readonly requestProcessor: RequestProcessor;

  readonly gameSwitcher: GameSwitcher;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.bookController = new StudentBookController();
    this.authController = new AuthController();
    this.wordsAPI = new WordsAPI();
    this.requestProcessor = new RequestProcessor();
    this.gameSwitcher = new GameSwitcher();
  }

  public renderPage(): void {
    const previousOpenedSection = this.bookController.getSection();
    const previousOpenedPage = this.bookController.getPage();
    if (previousOpenedSection && previousOpenedPage) {
      this.updatePageContainer(previousOpenedSection, previousOpenedPage);
      this.bookController.removeSectionAndPageFromStorage();
    } else {
      this.updatePageContainer();
    }
  }

  private async updatePageContainer(
    section = BOOK_SECTIONS.beginner,
    page = Numbers.One
  ): Promise<void> {
    const pageContainer = document.getElementById('app') as HTMLElement;
    pageContainer.classList.add('page_student-book');

    pageContainer.append(
      this.createPageTitle(),
      this.createGamesContainer(section.group, page),
      this.createBookSectionsContainer(section.className),
      this.createPaginationContainer(section, page)
    );
    pageContainer.append(await this.createWordsContainer(section, page));
  }

  private createPageTitle(): HTMLHeadingElement {
    const pageTitle: HTMLHeadingElement = this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h2',
      classNames: ['page__title'],
      innerText: PAGE_TITLES.studentBook,
    });
    return pageTitle;
  }

  private createGameLink(
    gameClass: string,
    gameName: string,
    section: number,
    page: number
  ): HTMLButtonElement {
    const gameLinkElement: HTMLButtonElement =
      this.elementCreator.createUIElement<HTMLButtonElement>({
        tag: 'button',
        classNames: ['games__game-link', `${gameClass}-link`],
        innerText: gameName,
      });
    switch (gameClass) {
      case GAMES.audiocall.className:
        gameLinkElement.addEventListener('click', (): void => {
          this.hideWordCards();
          this.gameSwitcher.startNewAudioCallGame(section, page);
        });
        break;
      case GAMES.sprint.className:
        gameLinkElement.addEventListener('click', (): void =>
          this.gameSwitcher.startNewSprintGame(section, page)
        );
        break;
      default:
        break;
    }
    return gameLinkElement;
  }

  private createGamesContainer(section: number, page: number): HTMLDivElement {
    const gamesContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['page__games', 'games'],
    });
    gamesContainer.append(
      this.createGameLink(GAMES.audiocall.className, GAMES.audiocall.name, section, page),
      this.createGameLink(GAMES.sprint.className, GAMES.sprint.name, section, page)
    );
    return gamesContainer;
  }

  private createBookSection(sectionName: string): HTMLDivElement {
    const bookSection: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['sections__book-section', sectionName.toLowerCase()],
      innerText: sectionName,
    });
    bookSection.addEventListener('click', async (event: Event): Promise<void> => {
      const newSection: IBookSectionInfo = this.bookController.switchSection(event);
      const wordsContainer = document.querySelector('.page__words') as HTMLDivElement;
      wordsContainer.innerHTML = NO_CONTENT;
      wordsContainer.append(this.createLoader(newSection.className));
      this.updateGamesButtons(newSection.group, Numbers.One);
      await this.fillWordsContainer(newSection, Numbers.One, wordsContainer);
    });
    return bookSection;
  }

  private createBookSectionsContainer(sectionClass: string): HTMLDivElement {
    const sectionsContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['page__sections', 'sections'],
    });
    const sections: IBookSectionInfo[] = Object.values(BOOK_SECTIONS);
    sections.forEach((sectionInfo: IBookSectionInfo): void => {
      const bookSection: HTMLDivElement = this.createBookSection(sectionInfo.text);
      if (sectionInfo.className === sectionClass) {
        bookSection.classList.add('active');
      }
      sectionsContainer.append(bookSection);
    });
    return sectionsContainer;
  }

  private createPaginationButton(buttonClass: string, page: number): HTMLButtonElement {
    const paginationButton: HTMLButtonElement =
      this.elementCreator.createUIElement<HTMLButtonElement>({
        tag: 'button',
        classNames: ['pagination__button', buttonClass],
      });
    if (page === Numbers.One && buttonClass === PAGINATION_BUTTONS.previous.className) {
      paginationButton.setAttribute('disabled', '');
    }
    if (page === MAX_PAGES_IN_BOOK_SECTION && buttonClass === PAGINATION_BUTTONS.next.className) {
      paginationButton.setAttribute('disabled', '');
    }
    paginationButton.addEventListener('click', async (event: Event): Promise<void> => {
      const newSectionAndPage: { page: number; section: IBookSectionInfo } =
        this.bookController.switchPage(event);
      const wordsContainer = document.querySelector('.page__words') as HTMLDivElement;
      wordsContainer.innerHTML = NO_CONTENT;
      wordsContainer.append(this.createLoader(newSectionAndPage.section.className));
      this.updateGamesButtons(newSectionAndPage.section.group, newSectionAndPage.page);
      await this.fillWordsContainer(
        newSectionAndPage.section,
        newSectionAndPage.page,
        wordsContainer
      );
    });
    return paginationButton;
  }

  private createPaginationContainer(
    section: IBookSectionInfo,
    currentPage: number
  ): HTMLDivElement {
    const paginationContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>(
      {
        tag: 'div',
        classNames: ['page__pagination', 'pagination'],
      }
    );

    const currentPageElement: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['pagination__current-page'],
      innerText: `${currentPage}`,
    });

    paginationContainer.append(
      this.createPaginationButton(PAGINATION_BUTTONS.previous.className, currentPage),
      currentPageElement,
      this.createPaginationButton(PAGINATION_BUTTONS.next.className, currentPage)
    );

    if (section === BOOK_SECTIONS.difficultWords) {
      paginationContainer.style.display = DISPLAY_MODES.contentNotVisible;
    }
    return paginationContainer;
  }

  private async createWordsContainer(
    section: IBookSectionInfo,
    page: number
  ): Promise<HTMLDivElement> {
    const wordsContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['page__words', 'words'],
    });
    wordsContainer.style.backgroundColor = section.color;
    await this.fillWordsContainer(section, page, wordsContainer);
    return wordsContainer;
  }

  private createWordsCards(words: IWord[] | IAggregatedWord[]): HTMLDivElement[] {
    return words.map(
      (word: IWord | IAggregatedWord): HTMLDivElement => new WordCard(word).createWordCard()
    );
  }

  private async createFilledWordsCards(
    section?: IBookSectionInfo,
    page?: number
  ): Promise<HTMLDivElement[]> {
    if (section && page) {
      return this.createWordsCards(await this.wordsAPI.getWords(section.group, page));
    }
    const words: IAggregatedWord[] = await this.requestProcessor.process<IAggregatedWord[]>(
      this.wordsAPI.getDifficultWords
    );
    const wordsSortedByDateOfMarkAsHard = words.sort(
      (currentWord: IAggregatedWord, nextWord: IAggregatedWord): number =>
        (currentWord.userWord.optional.dateOfMarkAsHard as number) -
        (nextWord.userWord.optional.dateOfMarkAsHard as number)
    );
    return this.createWordsCards(wordsSortedByDateOfMarkAsHard);
  }

  private async fillWordsContainer(
    section: IBookSectionInfo,
    page: number,
    container: HTMLDivElement
  ): Promise<void> {
    const wordsContainer: HTMLDivElement = container;
    if (section.text === BOOK_SECTIONS.difficultWords.text) {
      wordsContainer.classList.add('difficult-words');
      if (!this.authController.isUserAuthorized()) {
        wordsContainer.textContent = DIFFICULT_WORDS_CONTAINER_MESSAGES.forUnauthorized;
        this.bookController.disableGameLinks();
      } else {
        const difficultWordsCards = await this.createFilledWordsCards();
        if (difficultWordsCards.length) {
          wordsContainer.append(...difficultWordsCards);
        } else {
          wordsContainer.textContent = DIFFICULT_WORDS_CONTAINER_MESSAGES.noWords;
          this.bookController.disableGameLinks();
        }
      }
    } else {
      wordsContainer.classList.remove('difficult-words');
      wordsContainer.append(...(await this.createFilledWordsCards(section, page)));
    }
    const loader: HTMLDivElement | null = document.querySelector('.loader');
    if (loader) loader.remove();
  }

  private createLoader(className: string): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['loader', `loader-${className}`],
    });
  }

  private updateGamesButtons(section: number, page: number): void {
    const gameButtonsContainer = document.querySelector('.page__games') as HTMLDivElement;
    gameButtonsContainer.innerHTML = NO_CONTENT;
    gameButtonsContainer.append(
      this.createGameLink(GAMES.audiocall.className, GAMES.audiocall.name, section, page),
      this.createGameLink(GAMES.sprint.className, GAMES.sprint.name, section, page)
    );
  }

  private hideWordCards(): void {
    (document.querySelector('.page__words') as HTMLDivElement).style.display =
      DISPLAY_MODES.contentNotVisible;
  }
}
