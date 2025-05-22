import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Enseigne } from 'src/enseigne/entities/enseigne.entity';

export enum ContexteStatut {
  UTILISATEUR = 'utilisateur',
  ENSEIGNE = 'enseigne',
}

@Entity('statuts')
export class Statut {
  @ApiProperty({ description: 'Identifiant unique du statut' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nom du statut' })
  @Column({ name: 'nom', type: 'varchar', length: 100 })
  nom: string;

  @ApiProperty({ description: 'Description du statut' })
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Contexte du statut (utilisateur ou enseigne)',
    enum: ContexteStatut,
  })
  @Column({
    name: 'contexte',
    type: 'enum',
    enum: ContexteStatut,
  })
  contexte: ContexteStatut;

  @ApiProperty({
    description: 'Utilisateurs associés à ce statut',
    type: () => [Utilisateur],
    required: false,
  })
  @OneToMany(() => Utilisateur, (utilisateur) => utilisateur.statut)
  utilisateurs: Utilisateur[];

  @ApiProperty({
    description: 'Enseignes associées à ce statut',
    type: () => [Enseigne],
    required: false,
  })
  @OneToMany(() => Enseigne, (enseigne) => enseigne.statut)
  enseignes: Enseigne[];
}
