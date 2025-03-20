-- CreateEnum
CREATE TYPE "DOMAIN_PACK_STATUS" AS ENUM ('WAITING', 'ACTIVE', 'FAILED');

-- CreateEnum
CREATE TYPE "BILLING_STATUS" AS ENUM ('WAITING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "WEBHOOK_HTTP_METHODS" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE');

-- CreateEnum
CREATE TYPE "WEBHOOK_EVENTS" AS ENUM ('ON_START_PULL', 'ON_DONE_PULL', 'ON_START_BUILD', 'ON_DONE_BUILD', 'ON_FAILED_BUILD', 'ON_START_DEPLOY', 'ON_DONE_DEPLOY', 'ON_FAILED_DEPLOY');

-- CreateTable
CREATE TABLE "Users" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "profile_pic_url" VARCHAR(255) NOT NULL,
    "current_plan" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBalance" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "max_projects" INTEGER NOT NULL DEFAULT 10,
    "max_deployments" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "team_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectServices" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "environmentId" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsEnvironment" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectsEnvironment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectWebhooks" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "method" "WEBHOOK_HTTP_METHODS" NOT NULL DEFAULT 'GET',
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectWebhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectWebhookEvents" (
    "id" BIGSERIAL NOT NULL,
    "projectWebhookId" BIGINT NOT NULL,
    "event" "WEBHOOK_EVENTS" NOT NULL DEFAULT 'ON_START_PULL',

    CONSTRAINT "ProjectWebhookEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInTeam" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "team_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInTeamPermissions" (
    "userInTeamId" BIGINT NOT NULL,
    "permissionId" BIGINT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInTeamPermissions_pkey" PRIMARY KEY ("userInTeamId","permissionId")
);

-- CreateTable
CREATE TABLE "Domains" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "status" "DOMAIN_PACK_STATUS" NOT NULL DEFAULT 'WAITING',
    "note" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Billing" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "planId" BIGINT NOT NULL,
    "status" "BILLING_STATUS" NOT NULL DEFAULT 'WAITING',
    "expireAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueJob" (
    "id" BIGSERIAL NOT NULL,
    "message_id" TEXT NOT NULL,
    "message" JSONB NOT NULL,
    "entity" JSONB NOT NULL,
    "queue" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "error" JSON,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_userId_key" ON "UserBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_team_id_key" ON "Projects"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teams_slug_key" ON "Teams"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_name_key" ON "Permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Domains_projectId_key" ON "Domains"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "QueueJob_message_id_key" ON "QueueJob"("message_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_current_plan_fkey" FOREIGN KEY ("current_plan") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectServices" ADD CONSTRAINT "ProjectServices_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectServices" ADD CONSTRAINT "ProjectServices_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "ProjectsEnvironment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsEnvironment" ADD CONSTRAINT "ProjectsEnvironment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectWebhooks" ADD CONSTRAINT "ProjectWebhooks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectWebhookEvents" ADD CONSTRAINT "ProjectWebhookEvents_projectWebhookId_fkey" FOREIGN KEY ("projectWebhookId") REFERENCES "ProjectWebhooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeam" ADD CONSTRAINT "UserInTeam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeam" ADD CONSTRAINT "UserInTeam_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeamPermissions" ADD CONSTRAINT "UserInTeamPermissions_userInTeamId_fkey" FOREIGN KEY ("userInTeamId") REFERENCES "UserInTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeamPermissions" ADD CONSTRAINT "UserInTeamPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domains" ADD CONSTRAINT "Domains_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
