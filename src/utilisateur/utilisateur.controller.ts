import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UtilisateurController {
  constructor(private readonly userService: UtilisateurService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUtilisateurDto })
  @ApiCreatedResponse({ description: 'User has been successfully created' })
  create(@Body() createUserDto: CreateUtilisateurDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of all users' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUtilisateurDto })
  @ApiOkResponse({ description: 'User has been successfully updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUtilisateurDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User has been successfully deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @UseGuards(PermissionsGuard)
  @Permissions('delete:users')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign roles to a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roleIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of role IDs to assign to the user',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Roles assigned successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - insufficient permissions' })
  @UseGuards(PermissionsGuard)
  @Permissions('manage:user_roles')
  assignRoles(@Param('id') id: string, @Body('roleIds') roleIds: string[]) {
    return this.userService.assignRolesToUser(id, roleIds);
  }

  @Delete(':id/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove roles from a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roleIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of role IDs to remove from the user',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Roles removed successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - insufficient permissions' })
  @UseGuards(PermissionsGuard)
  @Permissions('manage:user_roles')
  removeRoles(@Param('id') id: string, @Body('roleIds') roleIds: string[]) {
    return this.userService.removeRolesFromUser(id, roleIds);
  }

  @Get(':id/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user roles' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User roles retrieved successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  getUserRoles(@Param('id') id: string) {
    return this.userService.findOne(id).then((user) => user.roles);
  }

  @Get(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user permissions (derived from roles)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User permissions retrieved successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserPermissions(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    // Extract unique permissions from all user roles
    const permissionsMap = new Map();
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissionsMap.set(permission.id, permission);
      });
    });

    return Array.from(permissionsMap.values());
  }
}
