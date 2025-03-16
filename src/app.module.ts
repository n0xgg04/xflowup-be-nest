import { GithubModule } from '@/github/github.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { createKeyv, Keyv } from '@keyv/redis';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { CacheableMemory } from 'cacheable';
import { AwsModule } from './aws/aws.module';
import { SqsModule } from './aws/sqs/sqs.module';
import { OctokitModule } from './octokit/octokit.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './users/auth/auth.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { UserModule } from './users/user.module';
import { ProjectModule } from './projects/project.module';
import { APP_FILTER } from '@nestjs/core';

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
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    OctokitModule,
    AwsModule,
    PrismaModule,
    GithubModule,
    AuthModule,
    SqsModule,
    UserModule,
    ProjectModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
