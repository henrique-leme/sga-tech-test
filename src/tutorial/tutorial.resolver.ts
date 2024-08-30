import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TutorialService } from './tutorial.service';
import { Tutorial } from './tutorial.entity';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Resolver(() => Tutorial)
export class TutorialResolver {
  constructor(private readonly tutorialService: TutorialService) {}

  @Query(() => [Tutorial])
  async tutorials(): Promise<Tutorial[]> {
    return this.tutorialService.findAll();
  }

  @Query(() => Tutorial)
  async tutorial(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Tutorial> {
    return this.tutorialService.findOne(id);
  }

  @Mutation(() => Tutorial)
  async createTutorial(
    @Args('createTutorialDto') createTutorialDto: CreateTutorialDto,
  ): Promise<Tutorial> {
    return this.tutorialService.create(createTutorialDto);
  }

  @Mutation(() => Tutorial)
  async updateTutorial(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateTutorialDto') updateTutorialDto: UpdateTutorialDto,
  ): Promise<Tutorial> {
    return this.tutorialService.update(id, updateTutorialDto);
  }

  @Mutation(() => Boolean)
  async deleteTutorial(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.tutorialService.remove(id);
    return true;
  }
}
