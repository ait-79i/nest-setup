/**
 * Données initiales des permissions pour peupler la base de données
 */
export const initialPermissions = [
  // Permissions Enseigne
  {
    name: 'create:enseigne',
    resource: 'enseigne',
    action: 'create',
    description: 'Créer une nouvelle enseigne',
  },
  {
    name: 'update:enseigne',
    resource: 'enseigne',
    action: 'update',
    description: 'Modifier une enseigne existante',
  },
  {
    name: 'delete:enseigne',
    resource: 'enseigne',
    action: 'delete',
    description: 'Supprimer une enseigne',
  },

  // Permissions Administrateur Enseigne
  {
    name: 'create:admin_enseigne',
    resource: 'admin_enseigne',
    action: 'create',
    description: 'Créer un nouvel administrateur enseigne',
  },
  {
    name: 'update:admin_enseigne',
    resource: 'admin_enseigne',
    action: 'update',
    description: 'Modifier un administrateur enseigne',
  },
  {
    name: 'delete:admin_enseigne',
    resource: 'admin_enseigne',
    action: 'delete',
    description: 'Supprimer un administrateur enseigne',
  },

  // Permissions Base documentaire
  {
    name: 'create:document',
    resource: 'document',
    action: 'create',
    description: 'Ajouter de nouveaux documents',
  },
  {
    name: 'update:document',
    resource: 'document',
    action: 'update',
    description: 'Modifier des documents existants',
  },
  {
    name: 'delete:document',
    resource: 'document',
    action: 'delete',
    description: 'Supprimer des documents',
  },

  // Permissions ICE Animation
  {
    name: 'access:ice_animation',
    resource: 'ice_animation',
    action: 'access',
    description: 'Accéder à ICE ANIMATION pour poser des questions',
  },

  // Permissions Assistant
  {
    name: 'create:assistant',
    resource: 'assistant',
    action: 'create',
    description: 'Créer de nouveaux assistants conversationnels',
  },
  {
    name: 'update:assistant',
    resource: 'assistant',
    action: 'update',
    description: 'Modifier des assistants existants',
  },
  {
    name: 'delete:assistant',
    resource: 'assistant',
    action: 'delete',
    description: 'Supprimer des assistants',
  },

  // Permissions Franchise
  {
    name: 'create:franchise',
    resource: 'franchise',
    action: 'create',
    description: 'Créer de nouvelles franchises',
  },
  {
    name: 'update:franchise',
    resource: 'franchise',
    action: 'update',
    description: 'Modifier des franchises existantes',
  },
  {
    name: 'delete:franchise',
    resource: 'franchise',
    action: 'delete',
    description: 'Supprimer des franchises',
  },
];

/**
 * Données initiales des rôles pour peupler la base de données
 */
export const initialRoles = [
  {
    name: 'super_administrateur',
    description:
      "Collaborateur BANQUISE ayant tous les droits d'administration sur les ICE de chaque enseigne",
    isDefault: false,
    permissions: [
      'create:enseigne',
      'update:enseigne',
      'delete:enseigne',
      'create:admin_enseigne',
      'update:admin_enseigne',
      'delete:admin_enseigne',
      'create:document',
      'update:document',
      'delete:document',
      'access:ice_animation',
      'create:assistant',
      'update:assistant',
      'delete:assistant',
      'create:franchise',
      'update:franchise',
      'delete:franchise',
    ],
  },
  {
    name: 'administrateur_enseigne',
    description:
      'Responsable ICE chez le franchiseur avec des droits étendus mais limités à son enseigne',
    isDefault: false,
    permissions: [
      'access:ice_animation',
      'create:assistant',
      'update:assistant',
      'delete:assistant',
      'create:franchise',
      'update:franchise',
      'delete:franchise',
    ],
  },
];
