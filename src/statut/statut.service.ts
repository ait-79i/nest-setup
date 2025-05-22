import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatutDto } from './dto/create-statut.dto';
import { UpdateStatutDto } from './dto/update-statut.dto';
import { Statut, ContexteStatut } from './entities/statut.entity';

@Injectable()
export class StatutService {
  constructor(
    @InjectRepository(Statut)
    private statutRepository: Repository<Statut>,
  ) {}

  async create(createStatutDto: CreateStatutDto): Promise<Statut> {
    const statut = this.statutRepository.create(createStatutDto);
    return this.statutRepository.save(statut);
  }

  async findAll(): Promise<Statut[]> {
    return this.statutRepository.find({
      relations: ['utilisateurs', 'enseignes'],
    });
  }

  async findByContext(contexte: ContexteStatut): Promise<Statut[]> {
    return this.statutRepository.find({
      where: { contexte },
      relations: ['utilisateurs', 'enseignes'],
    });
  }

  async findOne(id: string): Promise<Statut> {
    const statut = await this.statutRepository.findOne({
      where: { id },
      relations: ['utilisateurs', 'enseignes'],
    });

    if (!statut) {
      throw new NotFoundException(`Statut avec l'ID ${id} non trouvé`);
    }

    return statut;
  }

  async findByUser(userId: string): Promise<Statut[]> {
    return this.statutRepository.find({
      where: {
        utilisateurs: { id: userId },
        contexte: ContexteStatut.UTILISATEUR,
      },
      relations: ['utilisateurs'],
    });
  }

  async findByBrand(brandId: string): Promise<Statut[]> {
    return this.statutRepository.find({
      where: {
        enseignes: { id: brandId },
        contexte: ContexteStatut.ENSEIGNE,
      },
      relations: ['enseignes'],
    });
  }

  async update(id: string, updateStatusDto: UpdateStatutDto): Promise<Statut> {
    const statut = await this.findOne(id);

    await this.statutRepository.update(id, updateStatusDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const statut = await this.findOne(id);

    const result = await this.statutRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Statut avec l'ID ${id} non trouvé`);
    }
  }

  // Méthode pour initialiser les données de statut
  async initializeStatusData(): Promise<void> {
    // Vérifier si des données existent déjà
    const existingStatuts = await this.statutRepository.count();
    if (existingStatuts > 0) {
      console.log('Les données de statut existent déjà');
      return;
    }

    // Statuts pour les utilisateurs
    const userStatuts = [
      {
        nom: 'Actif',
        description: 'Utilisateur actif avec accès complet au système',
        contexte: ContexteStatut.UTILISATEUR,
      },
      {
        nom: 'Inactif',
        description: 'Utilisateur temporairement désactivé',
        contexte: ContexteStatut.UTILISATEUR,
      },
      {
        nom: 'Suspendu',
        description: 'Utilisateur suspendu pour violation des règles',
        contexte: ContexteStatut.UTILISATEUR,
      },
      {
        nom: 'En attente de validation',
        description:
          'Nouvel utilisateur en attente de validation par un administrateur',
        contexte: ContexteStatut.UTILISATEUR,
      },
      {
        nom: 'Archivé',
        description: 'Ancien utilisateur dont le compte a été archivé',
        contexte: ContexteStatut.UTILISATEUR,
      },
    ];

    // Statuts pour les enseignes (entreprises)
    const enseigneStatuts = [
      {
        nom: 'Active',
        description: 'Entreprise active avec tous les services disponibles',
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: "En période d'essai",
        description: "Entreprise en période d'essai avec accès limité",
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: 'Suspendue',
        description:
          'Entreprise temporairement suspendue pour des problèmes de paiement',
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: 'Résiliée',
        description: 'Entreprise ayant résilié son abonnement',
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: 'Premium',
        description:
          'Entreprise avec un abonnement premium et des fonctionnalités avancées',
        contexte: ContexteStatut.ENSEIGNE,
      },
      {
        nom: 'Standard',
        description: 'Entreprise avec un abonnement standard',
        contexte: ContexteStatut.ENSEIGNE,
      },
    ];

    // Créer les statuts pour les utilisateurs
    for (const statutData of userStatuts) {
      const statut = this.statutRepository.create(statutData);
      await this.statutRepository.save(statut);
    }

    // Créer les statuts pour les enseignes
    for (const statutData of enseigneStatuts) {
      const statut = this.statutRepository.create(statutData);
      await this.statutRepository.save(statut);
    }

    console.log('Données de statuts initialisées avec succès');
  }
}
