import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ClassConstructor, plainToInstance  } from 'class-transformer';
import convertKeys from 'convert-keys';
import pickBy from 'lodash/pickBy';
import qs from 'qs';

import ApiError from '@/api/api_error';
import { ApiDataResponse, ApiResponse } from '@/api/api_response';
import { applyCasingFix } from '@/api/fix_casing';

const API_ORIGIN = 'https://d2t22igidsgvxm.cloudfront.net';

export abstract class Api {
  private readonly axios: AxiosInstance;

  protected get baseUrl(): string {
    return `${API_ORIGIN}/api`;
  }

  constructor() {
    this.axios = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: this.baseUrl,
      withCredentials: true,
      paramsSerializer: (params) => {
        const newParams = convertKeys.toSnake(pickBy(params, Boolean));

        return qs.stringify(newParams, {
          arrayFormat: 'brackets',
        });
      },
    });

    applyCasingFix(this.axios);
  }

  /**
   * 通常のリクエスト（返ってきたデータを変換せずそのまま返す）
   */
  protected async request(config: AxiosRequestConfig) {
    const response = await this.executeRequest<ApiResponse>(config);

    return response.data;
  }

  /**
   * 1 つのデータを取得するリクエスト
   */
  protected async requestRaw<T>(
    config: AxiosRequestConfig,
    clazz: ClassConstructor<T>, // class は予約語なので、慣例的に clazz にする
  ): Promise<T> {
    const response = await this.executeRequest<T>(config);

    return plainToInstance(clazz, response.data);
  }

  /**
   * 1 つのデータを取得するリクエスト
   */
  protected async requestData<T>(
    config: AxiosRequestConfig,
    clazz: ClassConstructor<T>, // class は予約語なので、慣例的に clazz にする
  ): Promise<T> {
    const response = await this.executeRequest<ApiDataResponse<T>>(config);

    return plainToInstance(clazz, response.data.data);
  }

  private async executeRequest<D>(config: AxiosRequestConfig) {
    const response = await this.axios
      .request<D>(config)
      .then(res => this.validateResponse(res));

    return response;
  }

  private validateResponse<D>(response: AxiosResponse<D>) {
    if (response.status !== 200) {
      throw new ApiError(response);
    }

    return response;
  }
}
