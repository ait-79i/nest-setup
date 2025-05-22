import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsEmail,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUtilisateurDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2,
    required: true,
  })
  @IsString()
  @MinLength(2, { message: 'firstName must have atleast 2 characters.' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
    required: true,
  })
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+33612345678',
    minLength: 5,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Phone number must have at least 5 characters.' })
  phone: string;

  @ApiProperty({
    description:
      'User password (min 8 chars, max 20 chars, must include uppercase, lowercase, number, and special character)',
    example: 'Pass@word123',
    required: true,
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;
}
