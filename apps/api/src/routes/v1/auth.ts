import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import {
  decodeToken,
  encrypt,
  generateAccessToken,
  generateRefreshToken,
  logger,
} from "../../libs";
import { verifyToken } from "../../middlewares";
import { UserService } from "../../services";
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  EXPIRATION_TIME_MS_ACCESS_TOKEN,
  EXPIRATION_TIME_MS_REFRESH_TOKEN,
} from "../../utils";
import { UserValidator } from "../../validators";

export const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = res.getHeader("X-Request-Id");

    const reqBody = UserValidator.pick({ email: true, password: true }).parse(
      req.body,
    );

    const [user] = await new UserService().findBy({
      field: "email",
      value: reqBody.email,
    });

    if (
      !user.id ||
      !user.isActive ||
      user.password !== encrypt(reqBody.password)
    ) {
      logger.warn({ requestId }, "Attempt to sign in with wrong credentials");

      throw new ReferenceError();
    }

    const payload = {
      userId: user.id,
      isActive: user.isActive,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    logger.info({ requestId, payload: { ...user } }, "User authenticated");

    res.cookie(COOKIE_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      maxAge: EXPIRATION_TIME_MS_ACCESS_TOKEN,
    });
    res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: EXPIRATION_TIME_MS_REFRESH_TOKEN,
    });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

router.post(
  "/refresh",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = res.getHeader("X-Request-Id");

      const { refreshToken } = req.cookies;
      const { sub, isActive } = decodeToken(refreshToken);

      if (!sub) {
        logger.warn(
          { requestId },
          "Attempt to refresh token with invalid credentials",
        );

        throw new ReferenceError();
      }

      const payload = {
        userId: sub,
        isActive,
      };
      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      res.cookie(COOKIE_ACCESS_TOKEN, newAccessToken, {
        httpOnly: true,
        maxAge: EXPIRATION_TIME_MS_ACCESS_TOKEN,
      });
      res.cookie(COOKIE_REFRESH_TOKEN, newRefreshToken, {
        httpOnly: true,
        maxAge: EXPIRATION_TIME_MS_REFRESH_TOKEN,
      });
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);
