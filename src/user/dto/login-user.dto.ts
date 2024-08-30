import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'henriqueleme@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'veryStrongPassword123@',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
