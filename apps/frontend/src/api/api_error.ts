import { AxiosHeaders, AxiosResponse } from 'axios';
import { ApiResponse } from './api_response';

export default class ApiError {
  constructor(
    readonly response: AxiosResponse,
    readonly data: ApiResponse,
  ) {}

  static fromData(
    status: number,
    resultCode: string,
    message?: string,
  ) {
    return new ApiError(
      {
        headers: {
        },
        config: {
          headers: new AxiosHeaders(),
        },
        status,
        statusText: '',
        data: null,
      },
      {
        resultCode,
        message,
      },
    );
  }

  get status() {
    return this.response.status;
  }

  get resultCode() {
    return this.data.resultCode; // || ErrorConst.COMMON_UNKNOWN;
  }

  get details() {
    return this.data.details ?? [];
  }

  get message() {
    return this.data.message;
  }

  get messages() {
    return this.data.messages;
  }
}
