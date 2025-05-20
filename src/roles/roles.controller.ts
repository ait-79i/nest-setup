import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles with pagination' })
  @ApiResponse({ status: 200, description: 'Returns list of roles' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.rolesService.findAll(+page, +limit);
  }

  @Get('default')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all default roles' })
  @ApiResponse({ status: 200, description: 'Returns list of default roles' })
  findDefaultRoles() {
    return this.rolesService.findDefaultRoles();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'Returns the role' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a role by name' })
  @ApiResponse({ status: 200, description: 'Returns the role' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({ name: 'name', description: 'Role name' })
  findByName(@Param('name') name: string) {
    return this.rolesService.findByName(name);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Post(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add permissions to a role' })
  @ApiResponse({ status: 200, description: 'Permissions added successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        permissionIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of permission IDs to add to the role'
        }
      }
    }
  })
  addPermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.rolesService.addPermissionsToRole(id, permissionIds);
  }

  @Delete(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiResponse({ status: 200, description: 'Permissions removed successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        permissionIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of permission IDs to remove from the role'
        }
      }
    }
  })
  removePermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.rolesService.removePermissionsFromRole(id, permissionIds);
  }
}
