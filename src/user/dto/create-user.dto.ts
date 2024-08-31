import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType({ description: 'Dados necessários para criar um novo usuário' })
export class CreateUserDto {
  @Field({ description: 'Nome completo do usuário' })
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @Field({ description: 'Endereço de e-mail do usuário' })
  @IsEmail()
  email: string;

  @Field({ description: 'Senha do usuário' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
