import logger from "./logger";
import jwt from "jsonwebtoken";
import usersService from "../services/usersService";
import { Request, Response, NextFunction } from "express";
import { UserToken, UserType } from "../types";

const tokenExtractor = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.token) {
    req.token = "";
  }
  const decodedToken = jwt.verify(
    req.token,
    process.env.SECRET as string
  ) as UserToken;
  if (!decodedToken.id) {
    res.status(401).json({ error: "token missing or invalid" });
  }
  req.user = await usersService.getUserById(decodedToken.id);
  next();
};

const isUserAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.userType !== UserType.Admin) {
    res.status(401).json({ error: "you do not have sufficient permissions" });
  } else {
    next();
  }
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "CastError") {
    res.status(400).json({ error: "malformatted mongoose id" });
  } else if (error.name === "ValidationError") {
    res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    res.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    res
      .status(401)
      .json({ error: "session expired: please log out and relogin" });
  } else if (error.name === "ParseError") {
    res.status(400).json({ error: error.message });
  } else {
    logger.error(error.message);
    next(error);
  }
};

export default {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
  isUserAdmin,
};
