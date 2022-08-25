import { AuthMode } from '../types';

export const BASE_URL = 'http://127.0.0.1:4000';

export const PATHS = {
  words: 'words',
  users: 'users',
  signIn: 'signin',
  tokens: 'tokens',
  aggregatedWords: 'aggregatedWords',
  statistics: 'statistics',
  settings: 'settings',
};

export const QUERY_KEYS = {
  group: 'group',
  page: 'page',
  wordsPerPage: 'wordsPerPage',
  filter: 'filter',
};

export const REQUEST_HEADERS = {
  contentType: 'Content-Type',
  accept: 'Accept',
  authorization: 'Authorization',
};

export const MODAL_TITLES = {
  signIn: 'Вход',
  signUp: 'Регистрация',
};

export const AUTH_FORM = {
  email: {
    label: 'Электронная почта',
    name: 'email',
    placeholder: 'user@email.com',
  },
  password: {
    label: 'Пароль',
    name: 'password',
    placeholder: '********',
  },
};

export const BUTTON_TEXT = {
  signIn: 'Войти',
  signUp: 'Зарегистрироваться',
};

export const REDIRECTION_LINK_TEXT = {
  signIn: 'У меня уже есть аккаунт',
  signUp: 'Создать аккаунт',
};

export const NO_CONTENT = '';

export const STORAGE_KEYS = {
  user: '77-user',
  currentPage: '77-currentPage',
};

export const AUTH_MODAL_MODES: { [K in AuthMode]: AuthMode } = {
  signIn: 'signIn',
  signUp: 'signUp',
};

export const DEFAULT_AUTH_MODAL_MODE = 'signIn';
export const DEFAULT_PAGE_NAME = 'main';

export const AUTH_ERROR_MESSAGE = {
  email: 'Некорректный email',
  password: 'Длина пароля должна быть не менее 8 символов',
  userExists: 'Пользователь с таким email уже существует',
  invalidCredentials: 'Неверный логин или пароль',
  later: 'Ошибка, повторите попытку позже',
};

export const DISPLAY_MODES = {
  contentNotVisible: 'none',
  contentBlockVisible: 'block',
};

export const PAGE_TITLES = {
  about: 'Наша команда',
  studentBook: 'Учебник',
  games: 'Игры',
  statistics: 'Статистика',
};

export const GAMES = {
  audiocall: {
    name: 'Аудиовызов',
    className: 'audiocall',
    link: '',
  },
  sprint: {
    name: 'Спринт',
    className: 'sprint',
    link: '',
  },
};

export const BOOK_SECTIONS = {
  beginner: {
    text: 'A1',
    className: 'a1',
    color: '#FFDFDF',
    group: 0,
  },
  elementary: {
    text: 'A2',
    className: 'a2',
    color: '#FDDEC1',
    group: 1,
  },
  intermediate: {
    text: 'B1',
    className: 'b1',
    color: '#FFFCBE',
    group: 2,
  },
  upperIntermediate: {
    text: 'B2',
    className: 'b2',
    color: '#DBFFC5',
    group: 3,
  },
  advanced: {
    text: 'C1',
    className: 'c1',
    color: '#DDFBFF',
    group: 4,
  },
  proficient: {
    text: 'C2',
    className: 'c2',
    color: '#D5EAFE',
    group: 5,
  },
  difficultWords: {
    text: 'Superhero',
    className: 'superhero',
    color: '#E2DDFF',
  },
};

export const PAGINATION_BUTTONS = {
  previous: {
    className: 'button-previous',
  },
  next: {
    className: 'button-next',
  },
};

export const MAX_PAGES_IN_BOOK_SECTION = 30;

export const GAME_LIST_TITLE = 'Выберите игру:';
export const GAME_SELECTION_LEVEL_TITLE = 'Выберите уровень:';
export const GAME_RESULTS_TITLE = 'Результаты:';

export const GAME_ANSWER_RESULT_STATUS = {
  correct: 'correct',
  incorrect: 'incorrect',
};

export const AUDIOCALL_AUDIO_BUTTON_PLACEMENT = {
  inQuestion: 'question',
  inAnswer: 'answer',
};

export const AUDIOCALL_OPTIONS_NUMBER = 5;
