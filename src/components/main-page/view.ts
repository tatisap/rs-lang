import teamInfo from '../../data/team.json';
import appDescription from '../../data/app-description.json';
import { ITeamMember } from '../../types';
import UIElementsConstructor from '../../utils/ui-elements-creator';
import { PAGE_TITLES } from '../../constants/index';

export default class MainPageView {
  private elementCreator: UIElementsConstructor;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
  }

  private createPageIntroElement(description: string): HTMLParagraphElement {
    return this.elementCreator.createUIElement({
      tag: 'p',
      classNames: ['page__intro'],
      innerHTML: description,
    });
  }

  private createTeamMemberElement(teamMember: ITeamMember): HTMLLIElement {
    const avatar: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['member__img'],
    });
    const githubLink: HTMLAnchorElement = this.elementCreator.createUIElement<HTMLAnchorElement>({
      tag: 'a',
      classNames: ['member__link'],
    });
    githubLink.href = teamMember.github;
    const title: HTMLHeadingElement = this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['member__title'],
    });
    title.append(
      this.elementCreator.createUIElement<HTMLSpanElement>({
        tag: 'span',
        classNames: ['member__name'],
        innerText: teamMember.name,
      }),
      githubLink
    );
    const description: HTMLParagraphElement =
      this.elementCreator.createUIElement<HTMLParagraphElement>({
        tag: 'p',
        classNames: ['member__description'],
        innerText: teamMember.description,
      });
    const memberElement: HTMLLIElement = this.elementCreator.createUIElement<HTMLLIElement>({
      tag: 'li',
      classNames: ['team__member', 'member'],
    });
    memberElement.append(avatar, title, description);
    return memberElement;
  }

  private createTeamElement(team: ITeamMember[]): HTMLDivElement {
    const teamContainer: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['team'],
    });
    const teamList: HTMLUListElement = this.elementCreator.createUIElement<HTMLUListElement>({
      tag: 'ul',
      classNames: ['team__list'],
    });
    teamList.append(...team.map(this.createTeamMemberElement, this));
    teamContainer.append(
      this.elementCreator.createUIElement({
        tag: 'h2',
        classNames: ['page__title', 'team__title'],
        innerText: PAGE_TITLES.about,
      }),
      teamList
    );
    return teamContainer;
  }

  public renderPage(): void {
    const pageContainer: HTMLElement = document.getElementById('app') as HTMLElement;
    pageContainer.classList.add('page_about');
    pageContainer.append(
      this.createPageIntroElement(appDescription),
      this.createTeamElement(teamInfo)
    );
  }
}
