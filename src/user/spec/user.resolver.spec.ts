import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from '../user.resolver';
import { UserService } from '../user.service';
import { AuthService } from '../../auth/auth.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../user.entity';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            validateUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: '123456',
      };
      const user = { id: 1, ...createUserDto } as User;

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null);
      jest.spyOn(userService, 'create').mockResolvedValueOnce(user);

      const result = await resolver.createUser(createUserDto);
      expect(result).toEqual(user);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(userService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    });

    it('should throw ConflictException if email is already taken', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: '123456',
      };
      const existingUser = { id: 2, ...createUserDto } as User;

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(existingUser);

      await expect(resolver.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(userService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a valid token for valid credentials', async () => {
      const loginUserDto = {
        email: 'henriqueleme@example.com',
        password: '123456',
      };
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: 'hashedPassword123',
      } as User;
      const token = 'valid-jwt-token';

      jest.spyOn(userService, 'validateUser').mockResolvedValueOnce(user);
      jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce({ access_token: token });

      const result = await resolver.login(loginUserDto);
      expect(result).toBe(token);
      expect(authService.login).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException for invalid credentials', async () => {
      const loginUserDto = {
        email: 'invalid@example.com',
        password: 'wrongPassword',
      };

      jest.spyOn(userService, 'validateUser').mockResolvedValueOnce(null);

      await expect(resolver.login(loginUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('user', () => {
    it('should return a user by ID', async () => {
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
      } as User;
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      const result = await resolver.user(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      await expect(resolver.user(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update and return the updated user', async () => {
      const updateUserDto = { name: 'Updated', email: 'updated@example.com' };
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
      } as User;
      const updatedUser = { ...user, ...updateUserDto };

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null);
      jest.spyOn(userService, 'update').mockResolvedValueOnce(updatedUser);

      const result = await resolver.updateUser(1, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(userService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(userService.findByEmail).toHaveBeenCalledWith(updateUserDto.email);
    });

    it('should throw ConflictException if email is already taken by another user', async () => {
      const updateUserDto = { name: 'Updated', email: 'updated@example.com' };
      const existingUser = { id: 2, ...updateUserDto } as User;

      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(existingUser);

      await expect(resolver.updateUser(1, updateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(updateUserDto.email);
      expect(userService.update).not.toHaveBeenCalled();
    });
  });

  describe('removeUser', () => {
    it('should remove the user and return true', async () => {
      jest.spyOn(userService, 'remove').mockResolvedValueOnce();

      const result = await resolver.removeUser(1);
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(userService, 'remove')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(resolver.removeUser(1)).rejects.toThrow(NotFoundException);
    });
  });
});
