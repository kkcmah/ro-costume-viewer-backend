import logger from "./logger";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import { UserToken } from "../types";

const tokenExtractor = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.token) {
    req.token = "";
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET as string) as UserToken;
  if (!decodedToken.id) {
    res.status(401).json({ error: "token missing or invalid" });
  }
  req.user = await User.findById(decodedToken.id);
  next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    res.status(401).json({ error: "invalid token" });
  }

  next(error);
};

export default {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
