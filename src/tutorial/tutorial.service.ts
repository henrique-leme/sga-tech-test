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

  async findAll(): Promise<Tutorial[]> {
    return this.tutorialRepository.find();
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
    await this.findOne(id); // Verifica se o tutorial existe antes de atualizar
    await this.tutorialRepository.update(id, updateTutorialDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tutorialRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tutorial with ID ${id} not found`);
    }
  }

  async findByTitle(title: string): Promise<Tutorial[]> {
    return this.tutorialRepository.find({ where: { title } });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Tutorial[]> {
    return this.tutorialRepository
      .createQueryBuilder('tutorial')
      .where('tutorial.createdAt >= :startDate', { startDate })
      .andWhere('tutorial.createdAt <= :endDate', { endDate })
      .getMany();
  }
}
