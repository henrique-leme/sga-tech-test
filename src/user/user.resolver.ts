import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import {
  ConflictException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => [User])
  @UseGuards(AuthGuard)
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async user(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserData', { type: () => CreateUserDto })
    createUserData: CreateUserDto,
  ): Promise<User> {
    const existingUser = await this.userService.findByEmail(
      createUserData.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    return this.userService.create(createUserData);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUser(
    @Args('id', { type: () => Int })
    id: number,
    @Args('updateUserData', { type: () => UpdateUserDto })
    updateUserData: UpdateUserDto,
  ): Promise<User> {
    if (updateUserData.email) {
      const existingUser = await this.userService.findByEmail(
        updateUserData.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }
    return this.userService.update(id, updateUserData);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async removeUser(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<boolean> {
    await this.userService.remove(id);
    return true;
  }

  @Mutation(() => String)
  async login(
    @Args('loginUserData', { type: () => LoginUserDto })
    loginUserData: LoginUserDto,
  ): Promise<string> {
    const user = await this.userService.validateUser(
      loginUserData.email,
      loginUserData.password,
    );
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const { access_token } = await this.authService.login(user);
    return access_token;
  }

  @Mutation(() => User)
  async signUp(
    @Args('signUpData', { type: () => CreateUserDto })
    signUpData: CreateUserDto,
  ): Promise<User> {
    const existingUser = await this.userService.findByEmail(signUpData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    return this.userService.create(signUpData);
  }
}
