import AuthController from '../auth/auth-controller';

export default class RequestProcessor {
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
  }

  public async process<T>(request: (id: string, token: string) => Promise<T>): Promise<T> {
    const userId: string = this.authController.getUserId();
    let accessToken: string = this.authController.getAccessToken();
    try {
      return await request(userId, accessToken);
    } catch {
      this.authController.updateTokens();
      accessToken = this.authController.getAccessToken();
      return await request(userId, accessToken);
    }
  }
}
