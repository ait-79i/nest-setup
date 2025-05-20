import { 
  Column, 
  Entity, 
  ManyToMany, 
  PrimaryGeneratedColumn 
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('permissions')
export class Permission {
  @ApiProperty({ description: 'Unique identifier for the permission' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Permission name (e.g., create:user, read:user, etc.)' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Permission description' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Resource this permission applies to (e.g., users, posts, etc.)' })
  @Column()
  resource: string;

  @ApiProperty({ description: 'Action allowed on the resource (e.g., create, read, update, delete)' })
  @Column()
  action: string;

  // Roles will be defined through a join table from the Role entity
  // Avoiding direct reference here to prevent circular dependency
  @ManyToMany('Role', 'permissions')
  roles: any[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updatedAt: Date;
}
