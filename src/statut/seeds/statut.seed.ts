import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Statut, ContexteStatut } from '../entities/statut.entity';

@Injectable()
export class StatutSeedService {
  private readonly logger = new Logger(StatutSeedService.name);

  constructor(
    @InjectRepository(Statut)
    private statutRepository: Repository<Statut>,
  ) {}

  async seed(): Promise<void> {
    // Vérifier si des données existent déjà
    const existingStatuts = await this.statutRepository.count();
    if (existingStatuts > 0) {
      this.logger.log('Les données de statut existent déjà, seed ignoré');
      return;
    }

    // Statuts pour les utilisateurs
    const userStatuses = [
      {
        nom: 'Active',
        description: 'Utilisateur actif avec accès complet au système',
        contexte: ContexteStatut.UTILISATEUR,
      },
      {
        nom: 'Inactive',
        description: 'Utilisateur inactif sans accès au système',
        contexte: ContexteStatut.UTILISATEUR,
      },
      {
        nom: 'Pending',
        description: 'Utilisateur en attente de validation',
        contexte: ContexteStatut.UTILISATEUR,
      },
      {
        nom: 'Suspended',
        description: 'Utilisateur suspendu temporairement',
        contexte: ContexteStatut.UTILISATEUR,
      },
      {
        nom: 'Archived',
        description: 'Utilisateur archivé et désactivé',
        contexte: ContexteStatut.UTILISATEUR,
      },
    ];
    // Statuts pour les marques (entreprises)
    const EnseigneStatuses = [
      {
        nom: 'Active',
        description: 'Enseigne active avec tous les services disponibles',
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: 'Inactive',
        description: 'Enseigne inactive sans services accessibles',
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: 'Pending',
        description: "Enseigne en attente d'activation",
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: 'Suspended',
        description: 'Enseigne suspendue temporairement',
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: 'UnderReview',
        description: 'Enseigne en cours de vérification',
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: 'Archived',
        description: 'Enseigne archivée et désactivée',
        contexte: ContexteStatut.ENSEIGNE,
      },
    ];

    try {
      // Créer les statuts pour les utilisateurs
      for (const statusData of userStatuses) {
        const statut = this.statutRepository.create(statusData);
        await this.statutRepository.save(statut);
        this.logger.log(`Statut utilisateur créé: ${statut.nom}`);
      }

      // Créer les statuts pour les marques
      for (const statusData of EnseigneStatuses) {
        const statut = this.statutRepository.create(statusData);
        await this.statutRepository.save(statut);
        this.logger.log(`Statut enseigne créé: ${statut.nom}`);
      }

      this.logger.log('Données de statuts initialisées avec succès');
    } catch (error) {
      this.logger.error(
        "Erreur lors de l'initialisation des données de statuts",
        error,
      );
      throw error;
    }
  }
}
