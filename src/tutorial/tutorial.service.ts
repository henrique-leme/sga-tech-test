import { Injectable, NotFoundException } from '@nestjs/common';
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
    const tutorial = this.tutorialRepository.create(createTutorialDto);
    return this.tutorialRepository.save(tutorial);
  }

  async findAll({
    title,
    date,
  }: {
    title?: string;
    date?: string;
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

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Tutorial> {
    const tutorial = await this.tutorialRepository.findOne({ where: { id } });
    if (!tutorial) {
      throw new NotFoundException(`Tutorial with ID ${id} not found`);
    }
    return tutorial;
  }

  async update(
    id: number,
    updateTutorialDto: UpdateTutorialDto,
  ): Promise<Tutorial> {
    const tutorial = await this.findOne(id);
    if (!tutorial) {
      throw new NotFoundException(`Tutorial with ID ${id} not found`);
    }
    const updatedTutorial = { ...tutorial, ...updateTutorialDto };
    return this.tutorialRepository.save(updatedTutorial);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tutorialRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tutorial with ID ${id} not found`);
    }
  }
}
