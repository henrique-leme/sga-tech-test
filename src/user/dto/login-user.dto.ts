import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

@InputType({
  description: 'Dados necessários para realizar o login de um usuário',
})
export class LoginUserDto {
  @Field({ description: 'Endereço de e-mail registrado do usuário' })
  @IsEmail()
  email: string;

  @Field({ description: 'Senha do usuário, deve ter pelo menos 6 caracteres' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
