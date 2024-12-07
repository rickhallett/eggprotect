export interface Star {
  position: number;
  active: boolean;
  activatedAt: string;
  expiresAt: string;
}

export interface StarSystemConfig {
  totalStars: number;
  starDuration: number;
  cooldownPeriod: number;
}

export interface StarSystemState {
  stars: Star[];
  isInitialized: boolean;
}
