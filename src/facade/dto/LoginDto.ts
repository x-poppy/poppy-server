import { Validator } from '@augejs/koa';

export class LoginDto {
  @Validator.Length(5, 30)
  userName!: string;

  @Validator.Length(5, 30)
  password!: string;

  @Validator.Length(5, 100)
  domain!: string;
}
