/**
 * Profile Feature - Public API
 */

// Domain types
export type {
  LicenseInfo,
  GiftRedeemResult,
  LinkedProvider,
  ProfileSection,
  ProfileWindowOpenedPayload,
} from './domain/types';

// Composables
export { useProfile } from './presentation/composables/useProfile';

// Components
export { default as ProfileWindow } from './presentation/components/ProfileWindow.vue';
export { default as ProfileInfoSection } from './presentation/components/sections/ProfileInfoSection.vue';
export { default as LicenseClaimSection } from './presentation/components/sections/LicenseClaimSection.vue';
export { default as GiftRedeemSection } from './presentation/components/sections/GiftRedeemSection.vue';
export { default as LinkedAccountsSection } from './presentation/components/sections/LinkedAccountsSection.vue';
