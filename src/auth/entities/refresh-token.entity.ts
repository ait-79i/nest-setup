import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  isRevoked: boolean;

  @ManyToOne(() => Utilisateur, (user) => user.tokensRafraichissement, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Utilisateur;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
