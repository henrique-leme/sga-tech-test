import { Test, TestingModule } from '@nestjs/testing';
import { TutorialService } from '../tutorial.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tutorial } from '../tutorial.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TutorialService', () => {
  let service: TutorialService;
  let repository: Repository<Tutorial>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorialService,
        {
          provide: getRepositoryToken(Tutorial),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TutorialService>(TutorialService);
    repository = module.get<Repository<Tutorial>>(getRepositoryToken(Tutorial));
  });

  describe('create', () => {
    it('should create a new tutorial', async () => {
      const createTutorialDto = {
        title: 'New Tutorial',
        content: 'Content of the tutorial',
      };

      const tutorial = {
        id: 1,
        ...createTutorialDto,
      } as Tutorial;

      jest.spyOn(repository, 'save').mockResolvedValueOnce(tutorial);

      const result = await service.create(createTutorialDto);
      expect(result).toEqual(tutorial);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(createTutorialDto),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of tutorials', async () => {
      const tutorialArray = [
        {
          id: 1,
          title: 'Tutorial 1',
          content: 'Content of Tutorial 1',
        },
        {
          id: 2,
          title: 'Tutorial 2',
          content: 'Content of Tutorial 2',
        },
      ] as Tutorial[];

      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(tutorialArray),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValueOnce(queryBuilderMock as any);

      const result = await service.findAll({});
      expect(result).toEqual(tutorialArray);
    });
  });

  describe('findOne', () => {
    it('should return a tutorial by ID', async () => {
      const tutorial = {
        id: 1,
        title: 'Tutorial 1',
        content: 'Content of Tutorial 1',
      } as Tutorial;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(tutorial);

      const result = await service.findOne(1);
      expect(result).toEqual(tutorial);
    });

    it('should throw NotFoundException if tutorial is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated tutorial', async () => {
      const updateTutorialDto = { title: 'Updated Title' };
      const tutorial = {
        id: 1,
        title: 'Original Title',
        content: 'Original Content',
      } as Tutorial;

      const updatedTutorial = { ...tutorial, ...updateTutorialDto };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(tutorial);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(updatedTutorial);

      const result = await service.update(1, updateTutorialDto);
      expect(result).toEqual(updatedTutorial);
    });

    it('should throw NotFoundException if tutorial is not found during update', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.update(1, { title: 'Updated Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the tutorial if found', async () => {
      const tutorial = {
        id: 1,
        title: 'Tutorial to be removed',
        content: 'Content of the tutorial',
      } as Tutorial;

      const deleteResult = { affected: 1 };

      jest
        .spyOn(repository, 'delete')
        .mockResolvedValueOnce(deleteResult as any);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(tutorial);

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if tutorial is not found', async () => {
      const deleteResult = { affected: 0 };

      jest
        .spyOn(repository, 'delete')
        .mockResolvedValueOnce(deleteResult as any);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
