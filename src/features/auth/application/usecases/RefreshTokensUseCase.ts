import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import type { ITokenRepository } from '../../domain/repositories/ITokenRepository';
import type { Session } from '../../domain/entities/Session';
import { AuthError, AuthErrorCode } from '../../domain/errors';
import { runRefreshSingleFlight } from '../services/refreshSingleFlight';

/**
 * Use case для обновления токенов
 */
export class RefreshTokensUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenRepository: ITokenRepository
  ) {}

  async execute(): Promise<Session | null> {
    const sessionBefore = await this.tokenRepository.get();
    if (!sessionBefore?.refreshToken) {
      return null;
    }

    try {
      let refreshedSession: Session | null = null;

      await runRefreshSingleFlight(async () => {
        const currentSession = await this.tokenRepository.get();
        if (!currentSession?.refreshToken) {
          return;
        }

        const deviceId = this.tokenRepository.getDeviceId();
        refreshedSession = await this.authRepository.refreshTokens(
          currentSession.refreshToken,
          deviceId
        );
        await this.tokenRepository.save(refreshedSession);
      });

      return refreshedSession ?? (await this.tokenRepository.get());
    } catch (error) {
      if (error instanceof AuthError && error.code === AuthErrorCode.SessionExpired) {
        await this.tokenRepository.clear();
      }
      return null;
    }
  }
}
