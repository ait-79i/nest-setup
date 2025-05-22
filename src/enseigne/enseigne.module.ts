import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enseigne } from './entities/enseigne.entity';
import { Statut } from 'src/statut/entities/statut.entity';
import { StatutModule } from 'src/statut/statut.module';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { EnseigneService } from './enseigne.service';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { EnseigneController } from './enseigne.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enseigne, Utilisateur, Statut]),
    UtilisateurModule, // Import UtilisateurModule to make UserService available
    forwardRef(() => StatutModule), // Utiliser forwardRef pour éviter la dépendance circulaire
  ],
  controllers: [EnseigneController],
  providers: [EnseigneService],
  exports: [EnseigneService],
})
export class EnseigneModule {}
