import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import conf, { EnvironmentVariables } from './Common/conf';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGlobalGuard } from './auth/guards/jwt-auth.global.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seeds/seed.module';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { EnseigneModule } from './enseigne/enseigne.module';
import { StatutModule } from './statut/statut.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [conf],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        return {
          ...configService.get('database'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UtilisateurModule, // Load User module first since other entities depend on User
    RolesModule, // Load Roles module next since Auth depends on both User and Roles
    AuthModule,
    EnseigneModule,
    StatutModule, // Load Auth module last since it depends on User entity
    SeedModule, // Load Seed module to initialize data
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGlobalGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
