import { UserDto } from './user.dto';
export declare class PaginatedUserDto {
  data: UserDto[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  constructor(data: UserDto[], totalCount: number, currentPage: number, pageSize: number);
}
