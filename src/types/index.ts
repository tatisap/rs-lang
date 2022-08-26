export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserTokens {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface ITeamMember {
  name: string;
  github: string;
  description: string;
}

export interface IElement {
  tag: string;
  classNames: string[];
  innerText?: string;
}

export interface IInput extends Omit<IElement, 'tag'> {
  type: string;
  name: string;
  placeholder: string;
}

export interface ILabel extends Omit<IElement, 'tag'> {
  htmlFor: string;
}

export interface IMediaElement extends Omit<IElement, 'tag'> {
  url: string;
}

export type AuthMode = 'signIn' | 'signUp';

export interface IResponse {
  statusCode: StatusCode;
  content?: IUser | IUserTokens | ISignUpError | string;
}

export interface IAuthStatus {
  isSuccess: boolean;
  errorMessage?: string;
}

export type ErrorPath = 'email' | 'password';

export interface ISignUpError {
  error: {
    errors: { path: ErrorPath[] }[];
  };
}

export enum Numbers {
  Zero = 0,
  One = 1,
}

export enum StringifiedBoolean {
  True = 'true',
  False = 'false',
}

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum StatusCode {
  Ok = 200,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized,
  Forbidden = 403,
  NotFound,
  ExpectationFailed = 417,
  UnprocessableEntity = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
}

export enum KeyboardCode {
  Space = 'Space',
  Enter = 'Enter',
}

export interface IBookSectionInfo {
  text: string;
  className: string;
  color: string;
  group: number;
}

export type PageName = 'main' | 'studentBook' | 'games';

export type GameName = 'audiocall';

export interface IGameInfo {
  name: string;
  className: string;
}

export interface IGameCorrectAnswer {
  wordId: string;
  audioUrl: string;
  imageUrl: string;
  word: string;
  wordTranslation: string;
}

export interface IAudiocallAnswerOption {
  wordTranslation: string;
  isCorrect: boolean;
}

export interface IAudiocallQuestionInfo {
  correctAnswer: IGameCorrectAnswer;
  answerOptions: IAudiocallAnswerOption[];
}

export interface IGameQuestionResult {
  isCorrect: boolean;
  correctAnswer: IGameCorrectAnswer;
}
