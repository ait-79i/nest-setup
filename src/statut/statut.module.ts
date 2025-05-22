import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statut } from './entities/statut.entity';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { EnseigneModule } from 'src/enseigne/enseigne.module';
import { StatutController } from './statut.controller';
import { StatutService } from './statut.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statut]),
    UtilisateurModule, // Nécessaire pour le PermissionsGuard
    forwardRef(() => EnseigneModule), // Utiliser forwardRef pour éviter la dépendance circulaire
  ],
  controllers: [StatutController],
  providers: [StatutService],
  exports: [StatutService],
})
export class StatutModule {}
