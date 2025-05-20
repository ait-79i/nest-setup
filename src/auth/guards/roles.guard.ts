import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If there's no user or no user ID, deny access
    if (!user || !user.id) {
      return false;
    }

    // Check each required role
    for (const roleName of requiredRoles) {
      const hasRole = await this.userService.hasRole(user.id, roleName);
      if (hasRole) {
        return true; // User has at least one of the required roles
      }
    }

    return false; // User doesn't have any of the required roles
  }
}
