import UIElementsConstructor from '../../../utils/ui-elements-creator';
import {
  PAGE_TITLES,
  GAMES,
  BOOK_SECTIONS,
  PAGINATION_BUTTONS,
  MAX_PAGES_IN_BOOK_SECTION,
  DISPLAY_MODES,
  NO_CONTENT,
} from '../../../constants';
import { IBookSectionInfo, Numbers } from '../../../types';
import StudentBookController from '../controller';
import GameSwitcher from '../../games/game-switcher';

export default class StudentBookView {
  readonly elementCreator: UIElementsConstructor;

  readonly bookController: StudentBookController;

  readonly gameSwitcher: GameSwitcher;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
    this.bookController = new StudentBookController();
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

  private updatePageContainer(section = BOOK_SECTIONS.beginner, page = Numbers.One): void {
    const pageContainer = document.getElementById('app') as HTMLElement;
    pageContainer.classList.add('page_student-book');

    pageContainer.append(
      this.createPageTitle(),
      this.createGamesContainer(section.group, page),
      this.createBookSectionsContainer(section.className),
      this.createPaginationContainer(section, page),
      this.createWordsContainer(section.color)
    );
  }

  private createPageTitle(): HTMLHeadingElement {
    const pageTtitle: HTMLHeadingElement = this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h2',
      classNames: ['page__title'],
      innerText: PAGE_TITLES.studentBook,
    });
    return pageTtitle;
  }

  private createGameLink(
    gameClass: string,
    gameName: string,
    section: number,
    page: number
  ): HTMLAnchorElement {
    const gameLinkElement: HTMLAnchorElement =
      this.elementCreator.createUIElement<HTMLAnchorElement>({
        tag: 'span',
        classNames: ['games__game-link', `${gameClass}-link`],
        innerText: gameName,
      });
    switch (gameClass) {
      case GAMES.audiocall.className:
        gameLinkElement.addEventListener('click', (): void => {
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
    bookSection.addEventListener('click', (event: Event): void => {
      const newSection: IBookSectionInfo = this.bookController.switchSection(event);
      this.updateGamesButtons(newSection.group, Numbers.One);
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
    paginationButton.addEventListener('click', (event: Event): void => {
      const newPageAndSection: { page: number; section: IBookSectionInfo } =
        this.bookController.switchPage(event);
      this.updateGamesButtons(newPageAndSection.section.group, newPageAndSection.page);
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

  private createWordsContainer(sectionColor: string): HTMLDivElement {
    const wordsContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['page__words', 'words'],
    });
    wordsContainer.style.backgroundColor = sectionColor;
    return wordsContainer;
  }

  private updateGamesButtons(section: number, page: number): void {
    const gameButtonsContainer = document.querySelector('.page__games') as HTMLDivElement;
    gameButtonsContainer.innerHTML = NO_CONTENT;
    gameButtonsContainer.append(
      this.createGameLink(GAMES.audiocall.className, GAMES.audiocall.name, section, page),
      this.createGameLink(GAMES.sprint.className, GAMES.sprint.name, section, page)
    );
  }
}
