import { GithubModule } from '@/github/github.module';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { createKeyv, Keyv } from '@keyv/redis';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { CacheableMemory } from 'cacheable';
import { AwsModule } from './aws/aws.module';
import { SqsModule } from './aws/sqs/sqs.module';
import { OctokitModule } from './octokit/octokit.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './projects/project.module';
import { AuthModule } from './users/auth/auth.module';
import { UserModule } from './users/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheManagerModule } from './cache/cache.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    OctokitModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory(),
            }),
            createKeyv(configService.get<string>('REDIS_URL')),
          ],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [
        process.env.NODE_ENV !== 'production'
          ? ApolloServerPluginLandingPageLocalDefault()
          : ApolloServerPluginLandingPageProductionDefault(),
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
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
