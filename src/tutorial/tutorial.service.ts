import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutorial } from './tutorial.entity';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Injectable()
export class TutorialService {
  constructor(
    @InjectRepository(Tutorial)
    private readonly tutorialRepository: Repository<Tutorial>,
  ) {}

  async create(createTutorialDto: CreateTutorialDto): Promise<Tutorial> {
    const existingTutorial = await this.findByTitle(createTutorialDto.title);
    if (existingTutorial) {
      throw new ConflictException('Tutorial with this title already exists');
    }

    const tutorial = this.tutorialRepository.create(createTutorialDto);
    return this.tutorialRepository.save(tutorial);
  }

  async findAll({
    title,
    date,
    page = 1,
    limit = 10,
  }: {
    title?: string;
    date?: string;
    page?: number;
    limit?: number;
  }): Promise<Tutorial[]> {
    const queryBuilder = this.tutorialRepository.createQueryBuilder('tutorial');

    if (title) {
      queryBuilder.andWhere('tutorial.title LIKE :title', {
        title: `%${title}%`,
      });
    }

    if (date) {
      const [startDate, endDate] = date.split(',');
      if (startDate && endDate) {
        queryBuilder.andWhere(
          'tutorial.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      }
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Tutorial> {
    const tutorial = await this.tutorialRepository.findOne({ where: { id } });
    if (!tutorial) {
      throw new NotFoundException(`Tutorial with ID ${id} not found`);
    }
    return tutorial;
  }

  async findByTitle(title: string): Promise<Tutorial | null> {
    return this.tutorialRepository.findOne({ where: { title } });
  }

  async update(
    id: number,
    updateTutorialDto: UpdateTutorialDto,
  ): Promise<Tutorial> {
    const tutorial = await this.findOne(id);
    if (!tutorial) {
      throw new NotFoundException(`Tutorial with ID ${id} not found`);
    }

    const conflictingTutorial = await this.findByTitle(updateTutorialDto.title);
    if (conflictingTutorial && conflictingTutorial.id !== id) {
      throw new ConflictException(
        'Another tutorial with this title already exists',
      );
    }

    const updatedTutorial = { ...tutorial, ...updateTutorialDto };
    return this.tutorialRepository.save(updatedTutorial);
  }

  async remove(id: number): Promise<void> {
    const tutorial = await this.findOne(id);
    if (!tutorial) {
      throw new NotFoundException(`Tutorial with ID ${id} not found`);
    }
    await this.tutorialRepository.remove(tutorial);
  }
}
