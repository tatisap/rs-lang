import StudentBookController from './controller';
import { IBookSectionInfo, Numbers } from '../../types';
import { STORAGE_KEYS, BOOK_SECTIONS } from '../../constants';

export default class StudentBook {
  private controller: StudentBookController;

  constructor() {
    this.controller = new StudentBookController();
  }

  public init(): void {
    window.addEventListener('beforeunload', (): void => {
      this.saveSection();
      this.savePage();
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

  public getSection(): IBookSectionInfo {
    const sectionGroup = localStorage.getItem(STORAGE_KEYS.bookSection) as string;
    const sectionInfo: IBookSectionInfo = this.controller.getSectionInfo(sectionGroup);
    return sectionInfo || BOOK_SECTIONS.beginner;
  }

  public getPage(): number {
    return +(localStorage.getItem(STORAGE_KEYS.bookPage) as string) || Numbers.One;
  }
}
