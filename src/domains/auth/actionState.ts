export interface AuthActionState {
  error: string | null;
  requestId?: string | null;
}

export const INITIAL_AUTH_ACTION_STATE: AuthActionState = {
  error: null,
  requestId: null,
};
