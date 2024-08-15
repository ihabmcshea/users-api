import { UserDto } from './user.dto';

export class PaginatedUserDto {
  data: UserDto[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };

  constructor(data: UserDto[], totalCount: number, currentPage: number, pageSize: number) {
    this.data = data;
    this.meta = {
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage,
      pageSize,
    };
  }
}
