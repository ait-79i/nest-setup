import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// We use OmitType from @nestjs/swagger instead of @nestjs/mapped-types
// to ensure Swagger can properly detect and document the DTO
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // All properties from CreateUserDto are inherited as optional
}
