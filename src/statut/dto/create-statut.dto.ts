import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContexteStatut } from '../entities/statut.entity';

export class CreateStatutDto {
  @ApiProperty({
    description: 'Nom du statut',
    example: 'Actif',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    description: 'Description du statut',
    example: 'Utilisateur actif avec accès complet au système',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Contexte du statut (utilisateur ou enseigne)',
    enum: ContexteStatut,
    required: true,
  })
  @IsEnum(ContexteStatut)
  @IsNotEmpty()
  contexte: ContexteStatut;

  @ApiProperty({
    description: 'Utilisateurs associés (si contexte = utilisateur)',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    required: false,
    type: [String],
  })
  @IsOptional()
  utilisateurIds?: string[];

  @ApiProperty({
    description: 'Enseignes associées (si contexte = enseigne)',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    required: false,
    type: [String],
  })
  @IsOptional()
  enseigneIds?: string[];
}
