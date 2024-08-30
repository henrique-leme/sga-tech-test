import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Obter um usuário pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'O usuário foi encontrado.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'O usuário foi criado.',
    type: User,
  })
  @Mutation(() => User)
  async signup(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Login de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido, retorna um token JWT.',
  })
  @Mutation(() => String)
  async login(
    @Args('loginUserDto') loginUserDto: LoginUserDto,
  ): Promise<string> {
    const user = await this.userService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService
      .login(user)
      .then((response) => response.access_token);
  }
}
