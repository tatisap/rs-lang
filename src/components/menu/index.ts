import { PageName } from '../../types';

export default class Menu {
  public init(menuHandler: (event: Event) => void): void {
    (document.querySelector('.menu') as HTMLButtonElement).addEventListener(
      'click',
      (event: Event): void => {
        this.menuButtonHandler(event);
      }
    );
    (document.querySelector('.nav') as HTMLElement).addEventListener('click', menuHandler);
  }

  public setMenuItemActiveState(pageName: PageName): void {
    (
      document.querySelector(`.nav__item[data-page-name=${pageName}]`) as HTMLLIElement
    ).classList.add('nav__item_active');
  }

  public resetMenuItemsActiveState(): void {
    (document.querySelectorAll('.nav__item') as NodeListOf<HTMLLIElement>).forEach(
      (menuItem: HTMLLIElement): void => menuItem.classList.remove('nav__item_active')
    );
  }

  private menuButtonHandler(event: Event): void {
    if (!(event.target as HTMLButtonElement).classList.contains('menu_active')) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  private openMenu(): void {
    (document.querySelector('.menu') as HTMLButtonElement).classList.add('menu_active');
    (document.querySelector('.nav') as HTMLElement).classList.add('nav_opened');
  }

  public closeMenu(): void {
    (document.querySelector('.menu') as HTMLButtonElement).classList.remove('menu_active');
    (document.querySelector('.nav') as HTMLElement).classList.remove('nav_opened');
  }
}
