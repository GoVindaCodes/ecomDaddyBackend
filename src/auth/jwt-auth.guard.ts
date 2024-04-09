// jwt-auth.guard.ts

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Extract the Origin header from the request
    const origin = request.headers.origin;

    // Add your domain validation logic here
    const allowedDomains = ['http://localhost:3000/', 'https://another-allowed-domain.com'];
    const isAllowedDomain = allowedDomains.includes(origin);

    // if (!isAllowedDomain) {
    //   throw new UnauthorizedException('Invalid domain');
    // }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
