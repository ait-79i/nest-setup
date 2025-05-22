import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Statut } from 'src/statut/entities/statut.entity';

@Entity('enseignes')
export class Enseigne {
  @ApiProperty({ description: "Identifiant unique pour l'enseigne" })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: "Nom de l'enseigne" })
  @Column({ name: 'nom', type: 'varchar', unique: true })
  nom: string;

  @ApiProperty({ description: 'Adresse email de facturation' })
  @Column({ name: 'email_facturation', type: 'varchar', nullable: true })
  emailFacturation: string;

  @ApiProperty({ description: 'Date de début de facturation' })
  @Column({ name: 'date_debut_facturation', type: 'date', nullable: true })
  dateDebutFacturation: Date;

  @ApiProperty({ description: 'Configuration des règles IA' })
  @Column({ name: 'regles_ia', type: 'text', nullable: true })
  reglesIA: string;

  @ApiProperty({
    description: 'Utilisateurs appartenant à cette enseigne',
    type: () => [Utilisateur],
  })
  @OneToMany(() => Utilisateur, (utilisateur) => utilisateur.enseigne)
  utilisateurs: Utilisateur[];

  @ApiProperty({ description: "Date de création de l'enseigne" })
  @CreateDateColumn({
    name: 'date_creation',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreation: Date;

  @ApiProperty({ description: "Statut de l'enseigne", type: () => Statut })
  @ManyToOne(() => Statut, (statut) => statut.enseignes)
  @JoinColumn({ name: 'statut_id' })
  statut: Statut;
}
