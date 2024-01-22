// import { UserRoles } from './role.enum';

export interface JwtPayload {
  sub: number;
  //   role: UserRoles;
  type: 'access' | 'refresh';
  iat?: any;
  exp?: any;
}
