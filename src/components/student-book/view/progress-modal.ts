import WordsAPI from '../../../api/words-api';
import { GAMES, MODAL_TITLES, PROGRESS_TABLE_HEADINGS } from '../../../constants';
import { GameName, IUserWord, IUserWordDataByGame } from '../../../types';
import UIElementsConstructor from '../../../utils/ui-elements-creator';
import ModalWindow from '../../modal-window';
import RequestProcessor from '../../request-processor';
import UserWord from '../../user-word';

export default class WordProgressModal {
  private modalWindow: ModalWindow;

  private requestProcessor: RequestProcessor;

  private api: WordsAPI;

  private elementCreator: UIElementsConstructor;

  constructor() {
    this.modalWindow = new ModalWindow(MODAL_TITLES.learningProgress).init();
    this.requestProcessor = new RequestProcessor();
    this.api = new WordsAPI();
    this.elementCreator = new UIElementsConstructor();
  }

  public async open(wordId: string): Promise<void> {
    this.modalWindow.addContent(await this.createProgressTable(wordId));
    this.modalWindow.open();
  }

  private async getUserWords(): Promise<IUserWord[]> {
    const userWords: IUserWord[] = await this.requestProcessor.process<IUserWord[]>(
      this.api.getUserWords
    );
    return userWords;
  }

  private async getProgressInfo(wordId: string): Promise<IUserWordDataByGame> {
    const userWords: IUserWord[] = await this.getUserWords();
    const userWordInfo: IUserWord | undefined = userWords.find(
      (userWord: IUserWord): boolean => userWord.wordId === wordId
    );
    let userWordProgress: IUserWordDataByGame;
    if (userWordInfo) {
      userWordProgress = new UserWord().update(userWordInfo).getProgress();
    } else {
      userWordProgress = new UserWord().getProgress();
    }
    return userWordProgress;
  }

  private prepareTableBodyContent(progressInfo: IUserWordDataByGame): string[][] {
    return (Object.keys(progressInfo) as GameName[]).map((gameName: GameName): string[] => [
      GAMES[gameName].name,
      `${progressInfo[gameName].correctAnswersCounter}`,
      `${progressInfo[gameName].incorrectAnswersCounter}`,
    ]);
  }

  private async createProgressTable(wordId: string): Promise<HTMLTableElement> {
    const table: HTMLTableElement = this.elementCreator.createUIElement<HTMLTableElement>({
      tag: 'table',
      classNames: ['progress-table'],
    });
    const tableBodyContent: string[][] = this.prepareTableBodyContent(
      await this.getProgressInfo(wordId)
    );
    table.append(this.createTableHead(), this.createTableBody(tableBodyContent));
    return table;
  }

  private createTableHead(): HTMLTableSectionElement {
    const head: HTMLTableSectionElement =
      this.elementCreator.createUIElement<HTMLTableSectionElement>({
        tag: 'thead',
        classNames: ['progress-table__head'],
      });
    const row: HTMLTableRowElement = this.createTableRow(PROGRESS_TABLE_HEADINGS, 'th');
    head.append(row);
    return head;
  }

  private createTableBody(content: string[][]): HTMLTableSectionElement {
    const body: HTMLTableSectionElement =
      this.elementCreator.createUIElement<HTMLTableSectionElement>({
        tag: 'tbody',
        classNames: ['progress-table__body'],
      });
    const rows: HTMLTableRowElement[] = content.map(
      (contentItem: string[]): HTMLTableRowElement => this.createTableRow(contentItem, 'td')
    );
    body.append(...rows);
    return body;
  }

  private createTableRow(content: string[], cellTag: string): HTMLTableRowElement {
    const row: HTMLTableRowElement = this.elementCreator.createUIElement<HTMLTableRowElement>({
      tag: 'tr',
      classNames: ['progress-table__row'],
    });
    row.append(
      ...content.map(
        (contentItem: string): HTMLTableCellElement =>
          this.elementCreator.createUIElement<HTMLTableCellElement>({
            tag: cellTag,
            classNames: ['progress-table__cell'],
            innerText: contentItem,
          })
      )
    );
    return row;
  }
}
