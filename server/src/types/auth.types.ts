export interface LoginRequest {
  username?: unknown;
  password?: unknown;
}

export interface LoginResponse {
  isLoggedIn: true;
  username: string;
}
