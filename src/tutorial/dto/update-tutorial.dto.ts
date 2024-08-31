import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdateTutorialDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  id?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;
}
