import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Tutorial } from './tutorial.entity';
import { TutorialService } from './tutorial.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => Tutorial)
export class TutorialResolver {
  constructor(private readonly tutorialService: TutorialService) {}

  @Query(() => [Tutorial], {
    description:
      'Retorna uma lista de todos os tutoriais disponíveis. Você pode usar filtros opcionais como título ou data.',
  })
  async tutorials(
    @Args('title', {
      type: () => String,
      nullable: true,
      description: 'Filtro opcional pelo título do tutorial',
    })
    title?: string,
    @Args('date', {
      type: () => String,
      nullable: true,
      description:
        'Filtro opcional pela data de criação ou atualização. Formato: "YYYY-MM-DD,YYYY-MM-DD"',
    })
    date?: string,
  ): Promise<Tutorial[]> {
    return this.tutorialService.findAll({ title, date });
  }

  @Query(() => Tutorial, {
    description: 'Retorna um tutorial específico pelo seu ID.',
  })
  async tutorial(
    @Args('id', { type: () => Int, description: 'ID único do tutorial' })
    id: number,
  ): Promise<Tutorial> {
    return this.tutorialService.findOne(id);
  }

  @Mutation(() => Tutorial, {
    description: 'Cria um novo tutorial com título e conteúdo especificados.',
  })
  @UseGuards(AuthGuard)
  async createTutorial(
    @Args('createTutorialDto', {
      description: 'Dados para criação do tutorial',
    })
    createTutorialDto: CreateTutorialDto,
  ): Promise<Tutorial> {
    return this.tutorialService.create(createTutorialDto);
  }

  @Mutation(() => Tutorial, {
    description: 'Atualiza um tutorial existente pelo seu ID.',
  })
  @UseGuards(AuthGuard)
  async updateTutorial(
    @Args('id', { type: () => Int, description: 'ID único do tutorial' })
    id: number,
    @Args('updateTutorialDto', {
      description: 'Dados para atualização do tutorial',
    })
    updateTutorialDto: UpdateTutorialDto,
  ): Promise<Tutorial> {
    return this.tutorialService.update(id, updateTutorialDto);
  }

  @Mutation(() => Boolean, {
    description: 'Remove um tutorial existente pelo seu ID.',
  })
  @UseGuards(AuthGuard)
  async deleteTutorial(
    @Args('id', { type: () => Int, description: 'ID único do tutorial' })
    id: number,
  ): Promise<boolean> {
    await this.tutorialService.remove(id);
    return true;
  }
}
