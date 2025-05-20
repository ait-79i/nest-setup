import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '../auth/entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * Create a new permission
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  /**
   * Find all permissions with optional pagination
   */
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ items: Permission[]; total: number }> {
    const [items, total] = await this.permissionRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total };
  }

  /**
   * Find permission by ID
   */
  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  /**
   * Find permission by name
   */
  async findByName(name: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { name },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with name ${name} not found`);
    }

    return permission;
  }

  /**
   * Update a permission
   */
  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    // Update permission properties
    Object.assign(permission, updatePermissionDto);

    return await this.permissionRepository.save(permission);
  }

  /**
   * Delete a permission
   */
  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }

  /**
   * Find permissions by IDs
   */
  async findByIds(ids: string[]): Promise<Permission[]> {
    return await this.permissionRepository.findBy({
      id: In(ids),
    });
  }
}
