import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Tutorial } from './tutorial.entity';
import { TutorialService } from './tutorial.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import {
  ConflictException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
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
    @Args('page', {
      type: () => Int,
      nullable: true,
      description: 'Número da página para paginação',
    })
    page: number = 1,
    @Args('limit', {
      type: () => Int,
      nullable: true,
      description: 'Limite de tutoriais por página',
    })
    limit: number = 10,
  ): Promise<Tutorial[]> {
    return this.tutorialService.findAll({ title, date, page, limit });
  }

  @Query(() => Tutorial, {
    description: 'Retorna um tutorial específico pelo seu ID.',
  })
  async tutorial(
    @Args('id', { type: () => Int, description: 'ID único do tutorial' })
    id: number,
  ): Promise<Tutorial> {
    const tutorial = await this.tutorialService.findOne(id);
    if (!tutorial) {
      throw new NotFoundException('Tutorial not found');
    }
    return tutorial;
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
    const existingTutorial = await this.tutorialService.findByTitle(
      createTutorialDto.title,
    );
    if (existingTutorial) {
      throw new ConflictException('Tutorial with this title already exists');
    }
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
    const existingTutorial = await this.tutorialService.findOne(id);
    if (!existingTutorial) {
      throw new NotFoundException('Tutorial not found');
    }
    const conflictingTutorial = await this.tutorialService.findByTitle(
      updateTutorialDto.title,
    );
    if (conflictingTutorial && conflictingTutorial.id !== id) {
      throw new ConflictException(
        'Another tutorial with this title already exists',
      );
    }
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
    const existingTutorial = await this.tutorialService.findOne(id);
    if (!existingTutorial) {
      throw new NotFoundException('Tutorial not found');
    }
    await this.tutorialService.remove(id);
    return true;
  }
}
