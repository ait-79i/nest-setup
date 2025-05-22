import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { StatutSeedModule } from 'src/statut/seeds/statut-seed.module';

@Module({
  imports: [StatutSeedModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
