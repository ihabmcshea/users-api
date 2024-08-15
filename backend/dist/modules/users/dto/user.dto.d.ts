export declare class UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  verified: boolean;
  createdAt: Date;
  updatedAt?: Date;
  constructor(user: any);
}
