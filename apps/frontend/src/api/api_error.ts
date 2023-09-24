import { AxiosResponse } from 'axios';

export default class ApiError {
  constructor(
    readonly response: AxiosResponse,
  ) {}

  get status() {
    return this.response.status;
  }
}
