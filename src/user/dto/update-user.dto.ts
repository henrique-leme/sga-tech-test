import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

@InputType({
  description: 'Dados necessários para atualizar as informações de um usuário',
})
export class UpdateUserDto {
  @Field(() => Int, { description: 'ID único do usuário a ser atualizado' })
  @IsOptional()
  id?: number;

  @Field({
    nullable: true,
    description: 'Novo endereço de e-mail do usuário (opcional)',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true, description: 'Nova senha do usuário (opcional)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @Field({
    nullable: true,
    description: 'Novo nome completo do usuário (opcional)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @IsOptional()
  name?: string;
}
