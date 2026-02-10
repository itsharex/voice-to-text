export interface LicenseInfo {
  license_id: string;
  role: string;
  plan: string;
  status: string;
  seconds_limit: number;
  seconds_used: number;
  period_start: string;
  period_end: string;
  claimed_at: string;
}

export interface GiftRedeemResult {
  redeemed: boolean;
  seconds_added: number;
  bonus_seconds_balance: number;
}

export interface LinkedProvider {
  provider: string;
  provider_email: string | null;
  provider_name: string | null;
  linked_at: string;
}

export type ProfileSection = 'none' | 'license' | 'gift';

export interface ProfileWindowOpenedPayload {
  initialSection: ProfileSection;
}
