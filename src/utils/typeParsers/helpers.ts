import { EquipSlot } from "../../types";

export class ParseError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "ParseError";
  }
}

export const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const isNumber = (param: unknown): param is number => {
  return typeof param === "number" && !isNaN(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEquipSlot = (param: any): param is EquipSlot => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(EquipSlot).includes(param);
};

export const isBoolean = (param: unknown): param is boolean => {
  return typeof param === "boolean";
};
