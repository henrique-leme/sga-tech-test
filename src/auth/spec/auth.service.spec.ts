import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';
import { JwtPayload } from '../jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            validateUser: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: 'hashedPassword123',
      } as User;

      jest.spyOn(userService, 'validateUser').mockResolvedValueOnce(user);

      const result = await service.validateUser(
        'henriqueleme@example.com',
        '123456',
      );
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(userService, 'validateUser').mockResolvedValueOnce(null);

      await expect(
        service.validateUser('henriqueleme@example.com', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a valid JWT token', async () => {
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
        password: 'hashedPassword123',
      } as User;

      const payload: JwtPayload = { username: user.name, sub: user.id };
      const token = 'valid-jwt-token';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: token });
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe('validateToken', () => {
    it('should return a user if token is valid', async () => {
      const user = {
        id: 1,
        name: 'Henrique',
        email: 'henriqueleme@example.com',
      } as User;

      const payload: JwtPayload = { username: user.name, sub: user.id };
      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      const result = await service.validateToken('valid-jwt-token');
      expect(result).toEqual(user);
      expect(jwtService.verify).toHaveBeenCalledWith('valid-jwt-token');
      expect(userService.findOne).toHaveBeenCalledWith(payload.sub);
    });

    it('should return null if token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await service.validateToken('invalid-jwt-token');
      expect(result).toBeNull();
    });
  });
});
