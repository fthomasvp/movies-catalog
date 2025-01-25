import jwt, { JwtPayload } from "jsonwebtoken";

type JwtPayloadInfo = JwtPayload & {
  isActive: boolean;
};

type Payload = {
  userId: string;
  isActive: boolean;
};

export const generateAccessToken = (payload: Payload) =>
  jwt.sign({ isActive: payload.isActive }, process.env.SECRET_JWT as string, {
    expiresIn: "1m", // TODO: Update to 15m
    subject: payload.userId,
    issuer: "https://movies.catalog",
  });

export const generateRefreshToken = (payload: Payload) =>
  jwt.sign(
    { isActive: payload.isActive },
    process.env.SECRET_JWT_REFRESH as string,
    {
      expiresIn: "2m", // TODO: Update to 30m
      subject: payload.userId,
      issuer: "https://movies.catalog",
    },
  );

export const decodeToken = (token: string) =>
  jwt.decode(token, {}) as JwtPayloadInfo;

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.SECRET_JWT as string, {
    issuer: "https://movies.catalog",
  }) as JwtPayloadInfo;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, process.env.SECRET_JWT_REFRESH as string, {
    issuer: "https://movies.catalog",
  }) as JwtPayloadInfo;
