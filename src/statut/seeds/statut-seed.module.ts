import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statut } from '../entities/statut.entity';
import { StatutSeedService } from './statut.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Statut])],
  providers: [StatutSeedService],
  exports: [StatutSeedService],
})
export class StatutSeedModule {}
