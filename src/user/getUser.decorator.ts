import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'src/user/customTypes';

export const GetJwtPayload = createParamDecorator(
  (data: never, context: ExecutionContext): JwtPayload => {
    const req = context.switchToHttp().getRequest();
    return req['jwtPayload'] as JwtPayload;
  },
);
