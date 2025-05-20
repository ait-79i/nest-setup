import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionsService } from './permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService,
  ) {}

  /**
   * Create a new role
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { permissions: permissionIds, ...roleData } = createRoleDto;
    
    // Create new role
    const role = this.roleRepository.create(roleData);
    
    // Assign permissions if provided
    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.permissionsService.findByIds(permissionIds);
      role.permissions = permissions;
    }
    
    return await this.roleRepository.save(role);
  }

  /**
   * Find all roles with optional pagination
   */
  async findAll(page = 1, limit = 10): Promise<{ items: Role[]; total: number }> {
    const [items, total] = await this.roleRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['permissions'],
    });

    return { items, total };
  }

  /**
   * Find role by ID
   */
  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  /**
   * Find role by name
   */
  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return role;
  }

  /**
   * Find default roles
   */
  async findDefaultRoles(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { isDefault: true },
      relations: ['permissions'],
    });
  }

  /**
   * Update a role
   */
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { permissions: permissionIds, ...roleData } = updateRoleDto;
    const role = await this.findOne(id);
    
    // Update role properties
    Object.assign(role, roleData);
    
    // Update permissions if provided
    if (permissionIds) {
      const permissions = await this.permissionsService.findByIds(permissionIds);
      role.permissions = permissions;
    }
    
    return await this.roleRepository.save(role);
  }

  /**
   * Delete a role
   */
  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

  /**
   * Find roles by IDs
   */
  async findByIds(ids: string[]): Promise<Role[]> {
    return await this.roleRepository.findByIds(ids);
  }

  /**
   * Add permissions to a role
   */
  async addPermissionsToRole(roleId: string, permissionIds: string[]): Promise<Role> {
    const role = await this.findOne(roleId);
    const permissions = await this.permissionsService.findByIds(permissionIds);
    
    // Add new permissions to existing ones
    role.permissions = [...role.permissions, ...permissions];
    
    return await this.roleRepository.save(role);
  }

  /**
   * Remove permissions from a role
   */
  async removePermissionsFromRole(roleId: string, permissionIds: string[]): Promise<Role> {
    const role = await this.findOne(roleId);
    
    // Filter out permissions to remove
    role.permissions = role.permissions.filter(
      permission => !permissionIds.includes(permission.id)
    );
    
    return await this.roleRepository.save(role);
  }
}
