import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutorialDto {
  @ApiProperty({
    description: 'Título do tutorial',
    example: 'Exemplo de tutorial',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Conteúdo do tutorial',
    example: 'Este tutorial explica como usar o tutorial.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
