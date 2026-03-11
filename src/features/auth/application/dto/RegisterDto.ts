/**
 * Входные данные для регистрации
 */
export interface RegisterRequest {
  email: string;
  password: string;
}

/**
 * Результат регистрации
 */
export interface RegisterResponse {
  needsVerification: boolean;
  nextStep: 'verify_email' | 'password_setup';
}
