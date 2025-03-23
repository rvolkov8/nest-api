import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'src/common/interfaces/custom-types';

export const getJwtPayload = createParamDecorator(
  (data: never, context: ExecutionContext): JwtPayload => {
    const req = context.switchToHttp().getRequest();
    return req['jwtPayload'] as JwtPayload;
  },
);
