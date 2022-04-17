import { IUser } from "./models/user";

declare module "express-serve-static-core" {
  interface Request {
    token?: string;
    user?: IUser | null;
  }
}

export enum EquipSlot {
  Top = "Top",
  Middle = "Middle",
  Lower = "Lower",
  Garment = "Garment",
}

export interface UserToken {
  username: string;
  id: string;
}
