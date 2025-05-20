import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { Permission } from '../../auth/entities/permission.entity';
import { initialPermissions, initialRoles } from './initial-data';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * Automatically called when the module is initialized
   */
  async onModuleInit() {
    await this.seedPermissions();
    await this.seedRoles();
    this.logger.log('Database seeded with initial roles and permissions');
  }

  /**
   * Seed the database with initial permissions
   */
  private async seedPermissions() {
    const count = await this.permissionRepository.count();

    // Only seed if no permissions exist
    if (count === 0) {
      this.logger.log('Seeding permissions...');

      for (const permissionData of initialPermissions) {
        const permission = this.permissionRepository.create(permissionData);
        await this.permissionRepository.save(permission);
      }

      this.logger.log(`Created ${initialPermissions.length} permissions`);
    }
  }

  /**
   * Seed the database with initial roles and their permissions
   */
  private async seedRoles() {
    const count = await this.roleRepository.count();

    // Only seed if no roles exist
    if (count === 0) {
      this.logger.log('Seeding roles...');

      for (const roleData of initialRoles) {
        const { permissions: permissionNames, ...roleInfo } = roleData;

        // Create the role
        const role = this.roleRepository.create(roleInfo);

        // Find and assign permissions
        if (permissionNames && permissionNames.length > 0) {
          const permissions = await this.permissionRepository
            .createQueryBuilder('permission')
            .where('permission.name IN (:...names)', { names: permissionNames })
            .getMany();

          role.permissions = permissions;
        }

        await this.roleRepository.save(role);
      }

      this.logger.log(`Created ${initialRoles.length} roles`);
    }
  }
}
