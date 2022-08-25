import {
  BOOK_SECTIONS,
  DISPLAY_MODES,
  MAX_PAGES_IN_BOOK_SECTION,
  STORAGE_KEYS,
} from '../../../constants';
import { IBookSectionInfo, Numbers } from '../../../types';

export default class StudentBookController {
  private getSectionInfo(section: string): IBookSectionInfo {
    const chosenSectionInfo = Object.values(BOOK_SECTIONS).find(
      (sectionInfo: IBookSectionInfo): boolean =>
        sectionInfo.text === section || sectionInfo.group === +section
    ) as IBookSectionInfo;
    return chosenSectionInfo;
  }

  private resetPaginationButtons(): void {
    (
      document.querySelector('.pagination__button.button-previous') as HTMLButtonElement
    ).setAttribute('disabled', '');
    (
      document.querySelector('.pagination__button.button-next') as HTMLButtonElement
    ).removeAttribute('disabled');
    (
      document.querySelector('.pagination__current-page') as HTMLDivElement
    ).textContent = `${Numbers.One}`;
  }

  private updateSectionButtonsStyle(sectionText: string): void {
    const sectionButtons = document.querySelectorAll(
      '.sections__book-section'
    ) as NodeListOf<HTMLDivElement>;
    sectionButtons.forEach((sectionButton: HTMLDivElement): void => {
      if (sectionButton.textContent === sectionText) {
        sectionButton.classList.add('active');
      } else if (sectionButton.classList.contains('active')) {
        sectionButton.classList.remove('active');
      }
    });
  }

  private switchPaginationVisibility(sectionName: string): void {
    const paginationContainer = document.querySelector('.page__pagination') as HTMLDivElement;
    if (sectionName === BOOK_SECTIONS.difficultWords.text) {
      paginationContainer.style.display = DISPLAY_MODES.contentNotVisible;
    } else {
      paginationContainer.style.display = DISPLAY_MODES.contentFlexVisible;
    }
  }

  public switchSection(event: Event): IBookSectionInfo {
    const chosenSectionName = (event.target as HTMLDivElement).textContent as string;
    const chosenSectionInfo: IBookSectionInfo = this.getSectionInfo(chosenSectionName);
    const wordsContainer = document.querySelector('.page__words') as HTMLDivElement;

    wordsContainer.style.backgroundColor = chosenSectionInfo.color;
    this.resetPaginationButtons();
    this.updateSectionButtonsStyle(chosenSectionInfo.text);
    this.switchPaginationVisibility(chosenSectionName);

    return chosenSectionInfo;
  }

  public switchPage(event: Event): { page: number; section: IBookSectionInfo } {
    const chosenButton = event.target as HTMLButtonElement;
    const currentSectionName = (
      document.querySelector('.sections__book-section.active') as HTMLDivElement
    ).textContent as string;
    const currentSectionInfo: IBookSectionInfo = this.getSectionInfo(currentSectionName);
    const previousPageButton = document.querySelector(
      '.pagination__button.button-previous'
    ) as HTMLButtonElement;
    const nextPageButton = document.querySelector(
      '.pagination__button.button-next'
    ) as HTMLButtonElement;
    const currentPageContainer = document.querySelector(
      '.pagination__current-page'
    ) as HTMLDivElement;
    let currentPage: number = +(currentPageContainer.textContent as string);

    if (chosenButton.classList.contains('button-previous')) {
      if (currentPage === MAX_PAGES_IN_BOOK_SECTION) {
        nextPageButton.removeAttribute('disabled');
      }
      currentPage -= Numbers.One;
      if (currentPage === Numbers.One) {
        previousPageButton.setAttribute('disabled', '');
      }
    } else if (chosenButton.classList.contains('button-next')) {
      if (currentPage === Numbers.One) {
        previousPageButton.removeAttribute('disabled');
      }
      currentPage += Numbers.One;
      if (currentPage === MAX_PAGES_IN_BOOK_SECTION) {
        nextPageButton.setAttribute('disabled', '');
      }
    }
    currentPageContainer.textContent = `${currentPage}`;

    return { page: currentPage, section: currentSectionInfo };
  }

  public saveSection(): void {
    const currentSectionName = (
      document.querySelector('.sections__book-section.active') as HTMLDivElement
    ).textContent as string;
    const currentSectionInfo: IBookSectionInfo = this.getSectionInfo(currentSectionName);
    localStorage.setItem(STORAGE_KEYS.bookSection, `${currentSectionInfo.group}`);
  }

  public savePage(): void {
    const currentPageContainer = document.querySelector(
      '.pagination__current-page'
    ) as HTMLDivElement;
    const currentPage: number = +(currentPageContainer.textContent as string);
    localStorage.setItem(STORAGE_KEYS.bookPage, `${currentPage}`);
  }

  public getSection(): IBookSectionInfo {
    const sectionGroup = localStorage.getItem(STORAGE_KEYS.bookSection) as string;
    const sectionInfo: IBookSectionInfo = this.getSectionInfo(sectionGroup);
    return sectionInfo || BOOK_SECTIONS.beginner;
  }

  public getPage(): number {
    return +(localStorage.getItem(STORAGE_KEYS.bookPage) as string) || Numbers.One;
  }
}
