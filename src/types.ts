import { ICostume } from "./models/costume";
import { ICostumeSet } from "./models/costumeSet";
import { ICostumeTag } from "./models/costumeTag";
import { IUser } from "./models/user";

declare module "express-serve-static-core" {
  interface Request {
    token?: string;
    user?: IUser | null;
  }
}

export enum UserType {
  Normal = 0,
  Admin = 42,
}

export enum EquipSlot {
  Top = "Top",
  Middle = "Middle",
  Lower = "Lower",
  Garment = "Garment",
  Effect = "Effect",
}

export interface UserToken {
  username: string;
  id: string;
}

export interface UserLoginCreds {
  username: string;
  password: string;
}

export interface UserWithToken extends IUser {
  token: string;
}

export type NewCostume = Omit<ICostume, "id">;
export type NewCostumeSet = Omit<ICostumeSet, "id">;
export type NewCostumeTag = Omit<ICostumeTag, "id">;

export type CostumeSetUpdatableFields = Omit<NewCostumeSet, "likes" | "owner">;

export interface CostumesSearchParams {
  rows: number;
  page: number;
  itemId: number | null;
  name: string | null;
  equipSlots: EquipSlot[] | null;
  rowsOptions: number[];
  correctedParams: CorrectedCostumesSearchParams;
}

// make params optional and of type string for url on client side
// https://stackoverflow.com/questions/59796713/type-for-with-same-field-names-but-different-types
export type CorrectedCostumesSearchParams = {
  [K in keyof Omit<
    CostumesSearchParams,
    "rowsOptions" | "correctedParams"
  >]+?: string;
};

export interface CostumesWithCount {
  costumes: ICostume[];
  count: number;
}

export interface CostumeListRetObj extends CostumesWithCount {
  rowsOptions: number[];
  correctedParams: CorrectedCostumesSearchParams;
}
