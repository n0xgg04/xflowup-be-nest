import type { ColumnType } from 'kysely';
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type {
  DOMAIN_PACK_STATUS,
  BILLING_STATUS,
  WEBHOOK_HTTP_METHODS,
  WEBHOOK_EVENTS,
} from './enums';

export type Billing = {
  id: Generated<string>;
  userId: string;
  planId: string;
  status: Generated<BILLING_STATUS>;
  expireAt: Generated<Timestamp>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Domains = {
  id: Generated<string>;
  projectId: string;
  domain: string;
  status: Generated<DOMAIN_PACK_STATUS>;
  note: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Permissions = {
  id: Generated<string>;
  name: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Plan = {
  id: Generated<string>;
  name: string;
  price: Generated<number>;
  duration: Generated<number>;
  max_projects: Generated<number>;
  max_deployments: Generated<number>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Projects = {
  id: Generated<string>;
  slug: string;
  name: string;
  description: Generated<string | null>;
  url: Generated<string | null>;
  team_id: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type ProjectsEnvironment = {
  id: Generated<string>;
  projectId: string;
  name: string;
  description: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type ProjectServices = {
  id: Generated<string>;
  projectId: string;
  name: string;
  environmentId: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type ProjectWebhookEvents = {
  id: Generated<string>;
  projectWebhookId: string;
  event: Generated<WEBHOOK_EVENTS>;
};
export type ProjectWebhooks = {
  id: Generated<string>;
  projectId: string;
  url: string;
  method: Generated<WEBHOOK_HTTP_METHODS>;
  body: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type QueueJob = {
  id: Generated<string>;
  message_id: string;
  message: unknown;
  entity: unknown;
  queue: string;
  job_type: string;
  status: Generated<number>;
  counter: Generated<number>;
  error: unknown | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Teams = {
  id: Generated<string>;
  slug: string;
};
export type UserBalance = {
  id: Generated<string>;
  userId: string;
  balance: Generated<number>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type UserBanned = {
  id: Generated<string>;
  userId: string;
  reason: string;
  expires_at: Timestamp;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type UserInTeam = {
  id: Generated<string>;
  user_id: string;
  team_id: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type UserInTeamPermissions = {
  userInTeamId: string;
  permissionId: string;
  assignedAt: Generated<Timestamp>;
};
export type Users = {
  id: Generated<string>;
  email: string;
  name: string;
  profile_pic_url: string;
  current_plan: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type DB = {
  Billing: Billing;
  Domains: Domains;
  Permissions: Permissions;
  Plan: Plan;
  Projects: Projects;
  ProjectsEnvironment: ProjectsEnvironment;
  ProjectServices: ProjectServices;
  ProjectWebhookEvents: ProjectWebhookEvents;
  ProjectWebhooks: ProjectWebhooks;
  QueueJob: QueueJob;
  Teams: Teams;
  UserBalance: UserBalance;
  UserBanned: UserBanned;
  UserInTeam: UserInTeam;
  UserInTeamPermissions: UserInTeamPermissions;
  Users: Users;
};
