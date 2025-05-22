import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUUID,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Statut } from 'src/statut/entities/statut.entity';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';

export class CreateEnseigneDto {
  @ApiProperty({
    description: 'Nom de la marque',
    example: 'Acme Corporation',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    description: 'Adresse email de facturation',
    example: 'billing@acmecorp.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  emailFacturation?: string;

  @ApiProperty({
    description: 'Date de début de facturation',
    example: '2025-05-21',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateDebutFacturation?: Date;

  @ApiProperty({
    description: 'Configuration des règles IA',
    example: '{"maxTokens": 1000, "allowedModels": ["gpt-4"]}',
    required: false,
  })
  @IsString()
  @IsOptional()
  reglesIA?: string;

  @IsOptional()
  statutId?: Statut;

  @IsOptional()
  utilisateurs?: Utilisateur[];
}
