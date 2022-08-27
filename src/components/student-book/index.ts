import StudentBookController from './controller';
import { IBookSectionInfo } from '../../types';
import { STORAGE_KEYS, PAGE_TITLES } from '../../constants';

export default class StudentBook {
  private controller: StudentBookController;

  constructor() {
    this.controller = new StudentBookController();
  }

  public init(): void {
    window.addEventListener('beforeunload', (): void => {
      const currentPage = (document.querySelector('.page__title') as HTMLHeadingElement)
        .textContent as string;
      if (currentPage === PAGE_TITLES.studentBook) {
        this.saveSection();
        this.savePage();
      }
    });
  }

  private saveSection(): void {
    const currentSectionName = (
      document.querySelector('.sections__book-section.active') as HTMLDivElement
    ).textContent as string;
    const currentSectionInfo: IBookSectionInfo = this.controller.getSectionInfo(currentSectionName);
    localStorage.setItem(STORAGE_KEYS.bookSection, `${currentSectionInfo.group}`);
  }

  private savePage(): void {
    const currentPageContainer = document.querySelector(
      '.pagination__current-page'
    ) as HTMLDivElement;
    const currentPage: number = +(currentPageContainer.textContent as string);
    localStorage.setItem(STORAGE_KEYS.bookPage, `${currentPage}`);
  }
}
