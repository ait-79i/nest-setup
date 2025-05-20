/**
 * Initial permissions data for seeding the database
 */
export const initialPermissions = [
  // User permissions
  { name: 'create:users', resource: 'users', action: 'create', description: 'Create new users' },
  { name: 'read:users', resource: 'users', action: 'read', description: 'Read user information' },
  { name: 'update:users', resource: 'users', action: 'update', description: 'Update user information' },
  { name: 'delete:users', resource: 'users', action: 'delete', description: 'Delete users' },
  { name: 'manage:user_roles', resource: 'users', action: 'manage', description: 'Assign or remove roles from users' },
  
  // Role permissions
  { name: 'create:roles', resource: 'roles', action: 'create', description: 'Create new roles' },
  { name: 'read:roles', resource: 'roles', action: 'read', description: 'Read role information' },
  { name: 'update:roles', resource: 'roles', action: 'update', description: 'Update role information' },
  { name: 'delete:roles', resource: 'roles', action: 'delete', description: 'Delete roles' },
  { name: 'manage:role_permissions', resource: 'roles', action: 'manage', description: 'Assign or remove permissions from roles' },
  
  // Permission permissions
  { name: 'create:permissions', resource: 'permissions', action: 'create', description: 'Create new permissions' },
  { name: 'read:permissions', resource: 'permissions', action: 'read', description: 'Read permission information' },
  { name: 'update:permissions', resource: 'permissions', action: 'update', description: 'Update permission information' },
  { name: 'delete:permissions', resource: 'permissions', action: 'delete', description: 'Delete permissions' },
  
  // System permissions
  { name: 'access:admin', resource: 'system', action: 'access', description: 'Access admin features' },
  { name: 'manage:system', resource: 'system', action: 'manage', description: 'Manage system settings' },
];

/**
 * Initial roles data for seeding the database
 */
export const initialRoles = [
  {
    name: 'admin',
    description: 'Administrator with full access',
    isDefault: false,
    permissions: [
      'create:users', 'read:users', 'update:users', 'delete:users', 'manage:user_roles',
      'create:roles', 'read:roles', 'update:roles', 'delete:roles', 'manage:role_permissions',
      'create:permissions', 'read:permissions', 'update:permissions', 'delete:permissions',
      'access:admin', 'manage:system'
    ]
  },
  {
    name: 'editor',
    description: 'Editor with content management privileges',
    isDefault: false,
    permissions: [
      'read:users',
      'read:roles', 'read:permissions'
    ]
  },
  {
    name: 'user',
    description: 'Regular user with basic access',
    isDefault: true,
    permissions: [
      'read:users'
    ]
  }
];
