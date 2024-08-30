import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TutorialService } from './tutorial.service';
import { Tutorial } from './tutorial.entity';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tutorials')
@Resolver(() => Tutorial)
export class TutorialResolver {
  constructor(private readonly tutorialService: TutorialService) {}

  @ApiOperation({ summary: 'Listar todos os tutoriais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tutoriais.',
    type: [Tutorial],
  })
  @Query(() => [Tutorial])
  async tutorials(): Promise<Tutorial[]> {
    return this.tutorialService.findAll();
  }

  @ApiOperation({ summary: 'Obter um tutorial pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'O tutorial foi encontrado.',
    type: Tutorial,
  })
  @ApiResponse({ status: 404, description: 'Tutorial não encontrado.' })
  @Query(() => Tutorial)
  async tutorial(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Tutorial> {
    return this.tutorialService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar um novo tutorial' })
  @ApiResponse({
    status: 201,
    description: 'O tutorial foi criado.',
    type: Tutorial,
  })
  @Mutation(() => Tutorial)
  async createTutorial(
    @Args('createTutorialDto') createTutorialDto: CreateTutorialDto,
  ): Promise<Tutorial> {
    return this.tutorialService.create(createTutorialDto);
  }

  @ApiOperation({ summary: 'Atualizar um tutorial existente' })
  @ApiResponse({
    status: 200,
    description: 'O tutorial foi atualizado.',
    type: Tutorial,
  })
  @Mutation(() => Tutorial)
  async updateTutorial(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateTutorialDto') updateTutorialDto: UpdateTutorialDto,
  ): Promise<Tutorial> {
    return this.tutorialService.update(id, updateTutorialDto);
  }

  @ApiOperation({ summary: 'Deletar um tutorial pelo ID' })
  @ApiResponse({ status: 200, description: 'O tutorial foi deletado.' })
  @Mutation(() => Boolean)
  async deleteTutorial(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.tutorialService.remove(id);
    return true;
  }
}
