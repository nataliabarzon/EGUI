import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/roles.enum'; // Adjust the import path

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
