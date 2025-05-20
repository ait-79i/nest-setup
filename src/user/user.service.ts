import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    // Assign default roles to new user if any
    const defaultRoles = await this.roleRepository.find({
      where: { isDefault: true },
    });
    
    if (defaultRoles.length > 0) {
      user.roles = defaultRoles;
    }
    
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['roles', 'roles.permissions']
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions']
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions']
    });
  }
  
  /**
   * Assign roles to a user
   */
  async assignRolesToUser(userId: string, roleIds: string[]): Promise<User> {
    const user = await this.findOne(userId);
    const roles = await this.roleRepository.findByIds(roleIds);
    
    // Add new roles to existing ones (avoiding duplicates)
    const roleMap = new Map(user.roles.map(role => [role.id, role]));
    roles.forEach(role => roleMap.set(role.id, role));
    user.roles = Array.from(roleMap.values());
    
    return this.userRepository.save(user);
  }
  
  /**
   * Remove roles from a user
   */
  async removeRolesFromUser(userId: string, roleIds: string[]): Promise<User> {
    const user = await this.findOne(userId);
    
    // Filter out roles to remove
    user.roles = user.roles.filter(role => !roleIds.includes(role.id));
    
    return this.userRepository.save(user);
  }
  
  /**
   * Check if a user has a specific role
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const user = await this.findOne(userId);
    return user.roles.some(role => role.name === roleName);
  }
  
  /**
   * Check if a user has a specific permission
   */
  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.findOne(userId);
    
    for (const role of user.roles) {
      if (role.permissions.some(permission => permission.name === permissionName)) {
        return true;
      }
    }
    
    return false;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    
    await this.userRepository.update(id, updateUserDto);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
