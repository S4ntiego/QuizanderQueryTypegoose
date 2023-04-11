import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";

export const signJwt = (
  payload: Object,
  key: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions = {}
) => {
  const privateKey = Buffer.from(config.get<string>(key), "base64").toString(
    "ascii"
  );
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = <T>(
  token: string,
  key: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null => {
  try {
    const publicKey = Buffer.from(config.get<string>(key), "base64").toString(
      "ascii"
    );

    //The "as T" is a type assertion, it tells the TypeScript compiler that the result of the verify method should be treated as the generic type "T" and not the default type "object". This allows the payload of the token to be returned as the expected type.
    // If the token is invalid or has expired, the jwt.verify will throw an error, and this function will return null.
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
