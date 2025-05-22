import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { Enseigne } from 'src/enseigne/entities/enseigne.entity';
import { Statut } from 'src/statut/entities/statut.entity';

@Entity('utilisateurs')
export class Utilisateur {
  @ApiProperty({ description: "Identifiant unique de l'utilisateur" })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: "Prénom de l'utilisateur" })
  @Column({ name: 'prenom', type: 'varchar', length: 100 })
  prenom: string;

  @ApiProperty({ description: "Nom de famille de l'utilisateur" })
  @Column({ name: 'nom', type: 'varchar', length: 100 })
  nom: string;

  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    uniqueItems: true,
  })
  @Column({ name: 'email', unique: true })
  email: string;

  @ApiProperty({ description: "Numéro de téléphone de l'utilisateur" })
  @Column({ name: 'telephone', type: 'varchar', length: 100 })
  telephone: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur (hashé)" })
  @Column({ name: 'mot_de_passe', type: 'varchar' })
  motDePasse: string;

  @ApiProperty({ description: "Rôles de l'utilisateur", type: () => [Role] })
  @ManyToMany(() => Role, (role) => role.utilisateurs, {
    eager: true, // Chargement automatique des rôles avec l'utilisateur
    cascade: true, // Autoriser les opérations en cascade
  })
  @JoinTable({
    name: 'utilisateurs_roles',
    joinColumn: { name: 'utilisateur_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @ApiProperty({
    description: "Tokens de rafraîchissement de l'utilisateur",
    type: () => [RefreshToken],
  })
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  tokensRafraichissement: RefreshToken[];

  @ApiProperty({ description: "Date de création de l'utilisateur" })
  @CreateDateColumn({
    name: 'date_creation',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreation: Date;

  @ApiProperty({ description: "Date de dernière mise à jour de l'utilisateur" })
  @UpdateDateColumn({
    name: 'date_mise_a_jour',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  dateMiseAJour: Date;

  @ApiProperty({
    description: 'Enseigne à laquelle cet utilisateur appartient',
    type: () => Enseigne,
  })
  @ManyToOne(() => Enseigne, (enseigne) => enseigne.utilisateurs)
  @JoinColumn({ name: 'enseigne_id' })
  enseigne: Enseigne;

  @ApiProperty({ description: "Statut de l'utilisateur", type: () => Statut })
  @ManyToOne(() => Statut, (statut) => statut.utilisateurs)
  @JoinColumn({ name: 'statut_id' })
  statut: Statut;
}
