import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Permission } from './permission.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Role {
  @ApiProperty({ description: 'Unique identifier for the role' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Role name (e.g., admin, editor, user)' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Role description' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Whether this is a default role assigned to new users' })
  @Column({ default: false })
  isDefault: boolean;

  @ManyToMany(() => Permission, permission => permission.roles, {
    cascade: true,
    eager: true
  })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
  })
  permissions: Permission[];

  // Users will be defined through a join table from the User entity
  // Avoiding direct reference here to prevent circular dependency
  @ManyToMany('User', 'roles')
  users: any[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updatedAt: Date;
}
