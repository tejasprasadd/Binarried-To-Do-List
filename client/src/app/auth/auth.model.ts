export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  isLoggedIn: boolean;
  username: string;
}
