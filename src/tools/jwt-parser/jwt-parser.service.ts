import jwt_decode, { InvalidTokenError } from 'jwt-decode';

interface JWT {
  header: Map<string, unknown>;
  payload: Map<string, unknown>;
}

export function safe_jwt_decode(raw_jwt: string): JWT {
  try {
    const header = jwt_decode(raw_jwt, { header: true }) as Map<string, unknown>;
    const payload = jwt_decode(raw_jwt) as Map<string, unknown>;
    return { header: header, payload: payload };
  } catch (e) {
    if (e instanceof InvalidTokenError) {
      return { header: new Map<string, unknown>(), payload: new Map<string, unknown>() };
    } else {
      throw e;
    }
  }
}
