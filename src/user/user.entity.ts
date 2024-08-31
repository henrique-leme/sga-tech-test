import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Entidade que representa um usuário no sistema' })
@Entity()
export class User {
  @Field(() => Int, { description: 'ID único do usuário' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({
    description: 'Endereço de e-mail do usuário. Deve ser único no sistema',
  })
  @Column({ unique: true })
  email: string;

  @Field({ description: 'Senha do usuário armazenada de forma segura' })
  @Column()
  password: string;

  @Field({ description: 'Nome completo do usuário' })
  @Column()
  name: string;
}
