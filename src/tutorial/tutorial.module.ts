import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialService } from './tutorial.service';
import { TutorialResolver } from './tutorial.resolver';
import { Tutorial } from './tutorial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutorial])],
  providers: [TutorialService, TutorialResolver],
})
export class TutorialModule {}
