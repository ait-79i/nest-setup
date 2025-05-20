import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    
    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If there's no user or no user ID, deny access
    if (!user || !user.id) {
      return false;
    }

    // Check each required permission
    for (const permissionName of requiredPermissions) {
      const hasPermission = await this.userService.hasPermission(user.id, permissionName);
      if (!hasPermission) {
        return false; // User is missing at least one required permission
      }
    }

    return true; // User has all required permissions
  }
}
