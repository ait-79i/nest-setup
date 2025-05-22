import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { StatutSeedService } from 'src/statut/seeds/statut.seed';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly statusSeedService: StatutSeedService) {}

  async onModuleInit() {
    if (
      process.env.NODE_ENV !== 'production' ||
      process.env.SEED_DATA === 'true'
    ) {
      await this.seed();
    }
  }

  async seed() {
    try {
      this.logger.log("Début de l'initialisation des données...");

      // Exécuter les seeds dans l'ordre approprié
      await this.statusSeedService.seed();

      this.logger.log('Initialisation des données terminée avec succès');
    } catch (error) {
      this.logger.error("Erreur lors de l'initialisation des données", error);
    }
  }
}
