import { UserLoginCreds } from "../../types";
import { isString, ParseError } from "./helpers";

const parseUsername = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new ParseError("Malformatted or missing username " + name);
  }
  return name;
};

const parsePassword = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new ParseError("Malformatted or missing password");
  }
  return name;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toUserLoginCreds = (object: any): UserLoginCreds => {
  const newPatient: UserLoginCreds = {
    username: parseUsername(object.username),
    password: parsePassword(object.password),
  };

  return newPatient;
};
