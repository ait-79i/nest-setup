import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { EnseigneService } from './enseigne.service';
import { CreateEnseigneDto } from './dto/create-enseigne.dto';
import { UpdateEnseigneDto } from './dto/update-enseigne.dto';

@ApiTags('brands')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('brands')
export class EnseigneController {
  constructor(private readonly enseigneService: EnseigneService) {}

  @Post()
  @Permissions('create:brand')
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({
    status: 201,
    description: 'The brand has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 409,
    description: 'Enseigne with this name already exists.',
  })
  create(@Body() createBrandDto: CreateEnseigneDto) {
    return this.enseigneService.create(createBrandDto);
  }

  @Get()
  @Permissions('read:brand')
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'Return all brands.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.enseigneService.findAll();
  }

  @Get(':id')
  @Permissions('read:brand')
  @ApiOperation({ summary: 'Get a brand by id' })
  @ApiParam({ name: 'id', description: 'Enseigne ID' })
  @ApiResponse({ status: 200, description: 'Return the brand.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Enseigne not found.' })
  findOne(@Param('id') id: string) {
    return this.enseigneService.findOne(id);
  }

  @Get('name/:name')
  @Permissions('read:brand')
  @ApiOperation({ summary: 'Get a brand by name' })
  @ApiParam({ name: 'name', description: 'Enseigne name' })
  @ApiResponse({ status: 200, description: 'Return the brand.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Enseigne not found.' })
  findByName(@Param('name') name: string) {
    return this.enseigneService.findByName(name);
  }

  @Patch(':id')
  @Permissions('update:brand')
  @ApiOperation({ summary: 'Update a brand' })
  @ApiParam({ name: 'id', description: 'Enseigne ID' })
  @ApiResponse({
    status: 200,
    description: 'The brand has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Enseigne not found.' })
  @ApiResponse({
    status: 409,
    description: 'Enseigne with this name already exists.',
  })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateEnseigneDto) {
    return this.enseigneService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @Permissions('delete:brand')
  @ApiOperation({ summary: 'Delete a brand' })
  @ApiParam({ name: 'id', description: 'Enseigne ID' })
  @ApiResponse({
    status: 200,
    description: 'The brand has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Enseigne not found.' })
  @ApiResponse({
    status: 409,
    description: 'Enseigne has associated users and cannot be deleted.',
  })
  remove(@Param('id') id: string) {
    return this.enseigneService.remove(id);
  }

  @Post(':brandId/users/:userId')
  @Permissions('update:brand')
  @ApiOperation({ summary: 'Add a user to a brand' })
  @ApiParam({ name: 'brandId', description: 'Enseigne ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully added to the brand.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Enseigne or user not found.' })
  addUserToBrand(
    @Param('brandId') brandId: string,
    @Param('userId') userId: string,
  ) {
    return this.enseigneService.addUserToEnseigne(brandId, userId);
  }

  @Delete(':brandId/users/:userId')
  @Permissions('update:brand')
  @ApiOperation({ summary: 'Remove a user from a brand' })
  @ApiParam({ name: 'brandId', description: 'Enseigne ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully removed from the brand.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Enseigne or user not found.' })
  removeUserFromBrand(
    @Param('brandId') brandId: string,
    @Param('userId') userId: string,
  ) {
    return this.enseigneService.removeUserFromBrand(brandId, userId);
  }

  @Get(':brandId/users')
  @Permissions('read:brand')
  @ApiOperation({ summary: 'Get all users in a brand' })
  @ApiParam({ name: 'brandId', description: 'Enseigne ID' })
  @ApiResponse({ status: 200, description: 'Return all users in the brand.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Enseigne not found.' })
  getUsersByBrand(@Param('brandId') brandId: string) {
    return this.enseigneService.getUsersByBrand(brandId);
  }
}
