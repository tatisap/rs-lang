import { DEFAULT_PAGE_NAME, NO_CONTENT, STORAGE_KEYS } from '../constants';
import { IBookSectionInfo, PageName } from '../types';
import Auth from './auth/auth';
import GamesHomepage from './games-homepage';
import MainPageView from './main-page/view';
import Menu from './menu';
import StudentBookView from './student-book/view';
import StudentBookController from './student-book/controller';

export default class App {
  private menu: Menu;

  private auth: Auth;

  private pages: {
    main: MainPageView;
    studentBook: StudentBookView;
    games: GamesHomepage;
  };

  private studentBookController: StudentBookController;

  constructor() {
    this.menu = new Menu();
    this.auth = new Auth();
    this.pages = {
      main: new MainPageView(),
      studentBook: new StudentBookView(),
      games: new GamesHomepage(),
    };
    this.studentBookController = new StudentBookController();
  }

  public start(): void {
    this.menu.init((event: Event): void => this.menuHandler(event));
    this.auth.init();

    window.addEventListener('beforeunload', (): void => {
      this.studentBookController.saveSection();
      this.studentBookController.savePage();
    });

    const currentPage: PageName = this.getCurrentPageName();
    const bookSection: IBookSectionInfo = this.studentBookController.getSection();
    const bookPage: number = this.studentBookController.getPage();
    if (currentPage === 'studentBook') {
      this.openPage(currentPage, bookSection, bookPage);
    } else {
      this.openPage(currentPage);
    }
    this.menu.setMenuItemActiveState(currentPage);
  }

  private menuHandler(event: Event): void {
    const menuItem: HTMLElement = event.target as HTMLElement;
    if (!menuItem.classList.contains('nav__item')) return;
    const pageName: PageName = menuItem.dataset.pageName as PageName;
    this.menu.resetMenuItemsActiveState();
    this.menu.setMenuItemActiveState(pageName);
    this.openPage(pageName);
    this.saveCurrentPageName(pageName);
    this.menu.closeMenu();
  }

  private openPage(pageName: PageName, bookSection?: IBookSectionInfo, bookPage?: number): void {
    (document.querySelector('#app') as HTMLElement).innerHTML = NO_CONTENT;
    if (bookSection && bookPage) {
      this.pages[pageName].renderPage(bookSection, bookPage);
    } else {
      this.pages[pageName].renderPage();
    }
  }

  private saveCurrentPageName(pageName: PageName): void {
    localStorage.setItem(STORAGE_KEYS.currentPage, pageName);
  }

  private getCurrentPageName(): PageName {
    return (localStorage.getItem(STORAGE_KEYS.currentPage) as PageName) || DEFAULT_PAGE_NAME;
  }
}
