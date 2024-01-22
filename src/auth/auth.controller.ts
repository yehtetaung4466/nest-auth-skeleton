import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { Request } from 'express';
import { GoogleGuard } from './guards/google.guard';
import { GithubGuard } from './guards/github.guard';
import { JwtPayload } from 'src/utils/token.payload';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { SocialUser } from 'src/utils/user.interface';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signUp(@Body() dto: SignupDto) {
    return this.authService.signUp(dto.name, dto.email, dto.password);
  }
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.authService.jwtRefresh(user.sub, user.exp);
  }
  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth(@Req() req: Request) {
    // Guard redirects
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async authCallback(@Req() req: Request) {
    const user = req.user as SocialUser;
    return await this.authService.createUserOrUpdate(
      user.username,
      user.email,
      'google',
      user.profile,
    );
  }
  @Get('github')
  @UseGuards(GithubGuard)
  async githubAuth(@Req() req: Request) {}

  @Get('github/callback')
  @UseGuards(GithubGuard)
  async githubCallback(@Req() req: Request) {
    const user = req.user as SocialUser;
    return await this.authService.createUserOrUpdate(
      user.username,
      user.email,
      'github',
      user.profile,
    );
  }
}
