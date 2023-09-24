export class LoginForm {
  state!: string;

  code!: string;

  constructor(state: string, code: string) {
    this.state = state;
    this.code = code;
  }
}
