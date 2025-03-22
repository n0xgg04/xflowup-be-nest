import { SetMetadata } from '@nestjs/common';
import { ProjectPermission } from '../roles';

export const Permissions = (permission?: ProjectPermission[]) =>
  SetMetadata('permissions:required', permission);
