import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User first name' })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({ description: 'User email address', uniqueItems: true })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User phone number' })
  @Column({ type: 'varchar', length: 100 })
  phone: string;

  @ApiProperty({ description: 'User password (hashed)' })
  @Column({ type: 'varchar' })
  password: string;
  
  @ApiProperty({ description: 'User roles', type: () => [Role] })
  @ManyToMany(() => Role, role => role.users, {
    eager: true, // Auto-load roles with user
    cascade: true // Allow cascading operations
  })
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];

  @ApiProperty({ description: 'User refresh tokens', type: () => [RefreshToken] })
  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];

  @ApiProperty({ description: 'User creation date' })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'User last update date' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
