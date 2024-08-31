import { Test, TestingModule } from '@nestjs/testing';
import { TutorialResolver } from '../tutorial.resolver';
import { TutorialService } from '../tutorial.service';
import { NotFoundException } from '@nestjs/common';
import { Tutorial } from '../tutorial.entity';
import { CreateTutorialDto } from '../dto/create-tutorial.dto';
import { UpdateTutorialDto } from '../dto/update-tutorial.dto';

describe('TutorialResolver', () => {
  let resolver: TutorialResolver;
  let service: TutorialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorialResolver,
        {
          provide: TutorialService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TutorialResolver>(TutorialResolver);
    service = module.get<TutorialService>(TutorialService);
  });

  describe('createTutorial', () => {
    it('should create and return a tutorial', async () => {
      const createTutorialDto: CreateTutorialDto = {
        title: 'New Tutorial',
        content: 'Content of the tutorial',
      };

      const tutorial = { id: 1, ...createTutorialDto } as Tutorial;

      jest.spyOn(service, 'create').mockResolvedValueOnce(tutorial);

      const result = await resolver.createTutorial(createTutorialDto);
      expect(result).toEqual(tutorial);
      expect(service.create).toHaveBeenCalledWith(createTutorialDto);
    });
  });

  describe('tutorials', () => {
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

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(tutorialArray);

      const result = await resolver.tutorials();
      expect(result).toEqual(tutorialArray);
    });
  });

  describe('tutorial', () => {
    it('should return a tutorial by ID', async () => {
      const tutorial = {
        id: 1,
        title: 'Tutorial 1',
        content: 'Content of Tutorial 1',
      } as Tutorial;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(tutorial);

      const result = await resolver.tutorial(1);
      expect(result).toEqual(tutorial);
    });

    it('should throw NotFoundException if tutorial is not found', async () => {
      jest.spyOn(service, 'findOne').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      await expect(resolver.tutorial(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTutorial', () => {
    it('should update and return the updated tutorial', async () => {
      const updateTutorialDto: UpdateTutorialDto = { title: 'Updated Title' };
      const tutorial = {
        id: 1,
        title: 'Original Title',
        content: 'Original Content',
      } as Tutorial;

      const updatedTutorial = { ...tutorial, ...updateTutorialDto };

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedTutorial);

      const result = await resolver.updateTutorial(1, updateTutorialDto);
      expect(result).toEqual(updatedTutorial);
    });
  });

  describe('deleteTutorial', () => {
    it('should remove the tutorial and return true', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce();

      const result = await resolver.deleteTutorial(1);
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if tutorial is not found', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(resolver.deleteTutorial(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
