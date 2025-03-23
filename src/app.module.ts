import { GithubModule } from './github/github.module';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AwsModule } from './aws/aws.module';
import { SqsModule } from './aws/sqs/sqs.module';
import { OctokitModule } from './octokit/octokit.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './projects/project.module';
import { AuthModule } from './users/auth/auth.module';
import { UserModule } from './users/user.module';
import { CacheManagerModule } from './cache/cache.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    SentryModule.forRoot(),
    OctokitModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [
        // process.env.NODE_ENV === 'production'
        //  ApolloServerPluginLandingProductionLocalDefault() ?
        ApolloServerPluginLandingPageLocalDefault(),
      ],
    }),
    OctokitModule,
    AwsModule,
    PrismaModule,
    GithubModule,
    AuthModule,
    SqsModule,
    UserModule,
    ProjectModule,
    CacheManagerModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,
        },
      ],
    }),
    MailModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
