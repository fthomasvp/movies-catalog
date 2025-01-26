export const DEFAULT_PAGINATION_LIMIT = 10;
export const DEFAULT_PAGINATION_OFFSET = 0;

export const COOKIE_ACCESS_TOKEN = "accessToken";
export const COOKIE_REFRESH_TOKEN = "refreshToken";

const MINUTE_IN_MS = 60 * 1000;
/** Access token's expiration time is 15 minutes. */
export const EXPIRATION_TIME_MS_ACCESS_TOKEN = 15 * MINUTE_IN_MS;
/** Refresh token's expiration time is 30 minutes */
export const EXPIRATION_TIME_MS_REFRESH_TOKEN = 30 * MINUTE_IN_MS;
