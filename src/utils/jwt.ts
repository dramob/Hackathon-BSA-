import decode from 'jwt-decode';

export interface JwtPayload {
  iss?: string;
  sub?: string; // Subject ID
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

export function decodeJwt(encodedJWT: string): JwtPayload {
  try {
    const decodedJwt = decode<JwtPayload>(encodedJWT) as JwtPayload;
    return decodedJwt;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    throw new Error("Invalid JWT");
  }
}