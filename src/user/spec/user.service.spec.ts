import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = {
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: '123456',
      };

      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        id: 1,
        ...createUserDto,
        password: hashedPassword,
      } as User);

      const result = await service.create(createUserDto);
      expect(result).toEqual({
        id: 1,
        ...createUserDto,
        password: hashedPassword,
      });
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: 'hashedPassword123',
      } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser(
        'henriqueleme@example.com',
        '123456',
      );
      expect(result).toEqual(user);
    });

    it('should return null if credentials are invalid', async () => {
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: 'hashedPassword123',
      } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.validateUser(
        'henriqueleme@example.com',
        'wrongPassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return the user if found', async () => {
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: 'hashedPassword123',
      } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the user and return the updated entity', async () => {
      const updateUserDto = { name: 'Updated', email: 'updated@example.com' };
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: 'hashedPassword123',
      } as User;
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...user,
        ...updateUserDto,
      });

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual({ ...user, ...updateUserDto });
    });
  });

  describe('remove', () => {
    it('should remove the user if found', async () => {
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: 'hashedPassword123',
      } as User;
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(user);

      await service.remove(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(repository, 'remove').mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
