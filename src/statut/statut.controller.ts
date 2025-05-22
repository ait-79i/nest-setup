import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateStatutDto } from './dto/create-statut.dto';
import { UpdateStatutDto } from './dto/update-statut.dto';
import { ContexteStatut } from './entities/statut.entity';
import { StatutService } from './statut.service';

@ApiTags('statuts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('statuts')
export class StatutController {
  constructor(private readonly statutService: StatutService) {}

  @Post()
  @Permissions('create:statut')
  @ApiOperation({ summary: 'Créer un nouveau statut' })
  @ApiResponse({ status: 201, description: 'Le statut a été créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  create(@Body() createStatutDto: CreateStatutDto) {
    return this.statutService.create(createStatutDto);
  }

  @Get()
  @Permissions('read:statut')
  @ApiOperation({ summary: 'Obtenir tous les statuts' })
  @ApiResponse({ status: 200, description: 'Retourne tous les statuts.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  findAll() {
    return this.statutService.findAll();
  }

  @Get('context/:context')
  @Permissions('read:statut')
  @ApiOperation({ summary: 'Obtenir les statuts par contexte' })
  @ApiParam({ name: 'context', enum: ContexteStatut, description: 'Contexte du statut (utilisateur ou enseigne)' })
  @ApiResponse({ status: 200, description: 'Retourne les statuts pour le contexte spécifié.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  findByContext(@Param('context') context: ContexteStatut) {
    return this.statutService.findByContext(context);
  }

  @Get('user/:userId')
  @Permissions('read:statut')
  @ApiOperation({ summary: 'Obtenir les statuts pour un utilisateur spécifique' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Retourne les statuts de l\'utilisateur.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  findByUser(@Param('userId') userId: string) {
    return this.statutService.findByUser(userId);
  }

  @Get('brand/:brandId')
  @Permissions('read:statut')
  @ApiOperation({ summary: 'Obtenir les statuts pour une marque spécifique' })
  @ApiParam({ name: 'brandId', description: 'ID de la marque' })
  @ApiResponse({ status: 200, description: 'Retourne les statuts de la marque.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  findByBrand(@Param('brandId') brandId: string) {
    return this.statutService.findByBrand(brandId);
  }

  @Get(':id')
  @Permissions('read:statut')
  @ApiOperation({ summary: 'Obtenir un statut par ID' })
  @ApiParam({ name: 'id', description: 'ID du statut' })
  @ApiResponse({ status: 200, description: 'Retourne le statut.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  @ApiResponse({ status: 404, description: 'Statut non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.statutService.findOne(id);
  }

  @Patch(':id')
  @Permissions('update:statut')
  @ApiOperation({ summary: 'Mettre à jour un statut existant' })
  @ApiParam({ name: 'id', description: 'ID du statut à mettre à jour' })
  @ApiResponse({ status: 200, description: 'Le statut a été mis à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Statut non trouvé.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  update(@Param('id') id: string, @Body() updateStatutDto: UpdateStatutDto) {
    return this.statutService.update(id, updateStatutDto);
  }

  @Delete(':id')
  @Permissions('delete:statut')
  @ApiOperation({ summary: 'Supprimer un statut' })
  @ApiParam({ name: 'id', description: 'ID du statut' })
  @ApiResponse({ status: 200, description: 'Le statut a été supprimé avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  @ApiResponse({ status: 404, description: 'Statut non trouvé.' })
  remove(@Param('id') id: string) {
    return this.statutService.remove(id);
  }

  @Post('initialize')
  @Permissions('create:status')
  @ApiOperation({ summary: 'Initialiser les données de statut' })
  @ApiResponse({ status: 200, description: 'Les données de statut ont été initialisées avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  initializeData() {
    return this.statutService.initializeStatusData();
  }
}
