"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedUserDto = void 0;
class PaginatedUserDto {
    constructor(data, totalCount, currentPage, pageSize) {
        this.data = data;
        this.meta = {
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage,
            pageSize,
        };
    }
}
exports.PaginatedUserDto = PaginatedUserDto;
//# sourceMappingURL=paginatedUser.dto.js.map