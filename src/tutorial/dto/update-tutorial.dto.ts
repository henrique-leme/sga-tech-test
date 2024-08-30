import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTutorialDto {
  @ApiProperty({
    description: 'Título do tutorial (opcional)',
    example: 'Como usar o novo Tutoriall',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @ApiProperty({
    description: 'Conteúdo do tutorial (opcional)',
    example: 'Este tutorial explica como o novo tutorial.',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;
}
