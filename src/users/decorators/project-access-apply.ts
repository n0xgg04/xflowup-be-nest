import { applyDecorators, ExecutionContext, UseGuards } from '@nestjs/common';
import { ProjectAccess } from '../roles/project_access';
import { ProjectPermission } from '../roles';

export function WithProjectAccess() {
  return applyDecorators(UseGuards(ProjectAccess));
}
