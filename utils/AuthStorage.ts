class AuthStorage {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";
  private static readonly USER_KEY = "auth_user";

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static setUser(user: object): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): object | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  static clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}

export default AuthStorage;
