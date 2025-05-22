import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enseigne } from './entities/enseigne.entity';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { ContexteStatut, Statut } from 'src/statut/entities/statut.entity';
import { CreateEnseigneDto } from './dto/create-enseigne.dto';
import { UpdateEnseigneDto } from './dto/update-enseigne.dto';

@Injectable()
export class EnseigneService {
  constructor(
    @InjectRepository(Enseigne)
    private enseigneRepository: Repository<Enseigne>,
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    @InjectRepository(Statut)
    private statusRepository: Repository<Statut>,
  ) {}

  async create(createEnseigneDto: CreateEnseigneDto) {}

  async findAll(): Promise<Enseigne[]> {
    return this.enseigneRepository.find({});
  }

  async findOne(id: string): Promise<Enseigne> {
    const enseigne = await this.enseigneRepository.findOne({
      where: { id },
    });

    if (!enseigne) {
      throw new NotFoundException(`Enseigne with ID ${id} not found`);
    }

    return enseigne;
  }

  async findByName(nom: string): Promise<Enseigne> {
    const enseigne = await this.enseigneRepository.findOne({
      where: { nom },
      relations: ['mainAdmin', 'users'],
    });

    if (!enseigne) {
      throw new NotFoundException(`Enseigne with nom '${nom}' not found`);
    }

    return enseigne;
  }

  async update(id: string, updateBrandDto: UpdateEnseigneDto) {}

  async addUserToEnseigne(
    enseigneId: string,
    userId: string,
  ): Promise<Enseigne> {
    const enseigne = await this.findOne(enseigneId);
    const user = await this.utilisateurRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur with ID ${userId} not found`);
    }

    // Update user's enseigne
    user.enseigne = enseigne;
    await this.utilisateurRepository.save(user);

    return this.findOne(enseigneId);
  }

  async removeUserFromBrand(
    enseigneId: string,
    userId: string,
  ): Promise<Enseigne> {
    const user = await this.utilisateurRepository.findOne({
      where: { id: userId },
      relations: ['enseigne'],
    });

    // Vérifier si l'utilisateur appartient à cette marque
    if (!user || user.enseigne?.id !== enseigneId) {
      throw new NotFoundException(
        `Utilisateur with ID ${userId} not found in enseigne with ID ${enseigneId}`,
      );
    }

    // Remove user from enseigne
    user.enseigne = null;
    await this.utilisateurRepository.save(user);

    return this.findOne(enseigneId);
  }

  async getUsersByBrand(enseigneId: string): Promise<Utilisateur[]> {
    return this.utilisateurRepository.find({
      where: { enseigne: { id: enseigneId } },
      relations: ['roles', 'roles.permissions', 'enseigne'],
    });
  }

  async remove(id: string) {}
}
