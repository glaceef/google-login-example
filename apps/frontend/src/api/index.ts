import { Api } from '@/api/api';
import { UrlResponse } from './api_response';
import { LoginForm } from './forms/login_form';
import { instanceToPlain } from 'class-transformer';

export class Client extends Api {
  constructor() {
    super();
  }

  async getLoginUrl() {
    const result = await this.requestRaw({
      method: 'get',
      url: '/login',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }, UrlResponse);

    return result.url;
  }

  async completeLogin(form: LoginForm) {
    await this.request({
      method: 'post',
      url: '/login',
      data: instanceToPlain(form),
    });
  }
}

export const client = new Client();
