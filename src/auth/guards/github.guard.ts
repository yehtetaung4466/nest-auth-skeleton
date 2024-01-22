import { AuthGuard } from '@nestjs/passport';

export class GithubGuard extends AuthGuard('github') {
  // handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
  //   console.log(err);
  //   console.log(info);
  //   // console.log(context);
  //   console.log(status);
  //   console.log(user);
  //   return user;
  // }
}
