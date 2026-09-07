export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResult {
  isSuccess: boolean;
  error: string;
  value: string | null;
}
