import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ 
    description: 'Permission name (e.g., create:user, read:user)', 
    example: 'read:users' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Permission description', 
    example: 'Allows reading user data',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Resource the permission applies to', 
    example: 'users' 
  })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiProperty({ 
    description: 'Action allowed on the resource', 
    example: 'read',
    enum: ['create', 'read', 'update', 'delete', 'manage'] 
  })
  @IsString()
  @IsNotEmpty()
  action: string;
}
