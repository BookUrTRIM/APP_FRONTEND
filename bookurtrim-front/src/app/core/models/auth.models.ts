export interface LoginDTO {
  email: string;
  password: string;
}

export interface SignupDTO {
  email: string;
  password: string;
  role: 'client' | 'provider';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: 'client' | 'provider';
}
