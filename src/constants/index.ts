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
};

export const AUTH_MODAL_MODES: { [K in AuthMode]: AuthMode } = {
  signIn: 'signIn',
  signUp: 'signUp',
};

export const DEFAULT_AUTH_MODAL_MODE = 'signIn';

export const PAGE_TITLES = {
  about: 'fff',
};
