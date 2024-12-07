export interface Star {
  position: number;
  active: boolean;
  expiresAt: string;
}

export interface StarSystemState {
  stars: Star[];
  loading: boolean;
  error: string | null;
}
