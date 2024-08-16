import { IPaginatedMetadata } from "./IPaginatedMetadata";
import { IUser } from "./IUser";

export interface PagintedUsers {
  data: IUser[];
  meta: IPaginatedMetadata;
}