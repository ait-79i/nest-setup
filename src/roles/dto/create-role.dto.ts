import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ 
    description: 'Role name', 
    example: 'editor' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Role description', 
    example: 'Can edit content but cannot delete',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Whether this is a default role assigned to new users', 
    example: false,
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({ 
    description: 'Array of permission IDs to assign to this role', 
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
    type: [String]
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  permissions?: string[];
}
