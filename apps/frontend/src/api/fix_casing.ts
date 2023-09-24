import axios, { AxiosInstance } from 'axios';
import * as convertKeys from 'convert-keys';
import isPlainObject from 'lodash/isPlainObject';

export function applyCasingFix(client: AxiosInstance): void {
  client.interceptors.request.use(configuration => {
    let { data } = configuration;

    if (isPlainObject(data)) {
      data = convertKeys.toSnake(data);
    }

    return {
      ...configuration,
      data,
    };
  });

  client.interceptors.response.use(
    response => {
      let { data } = response;

      if (response.config.responseType !== 'blob') {
        data = convertKeys.toCamel(data);
      }

      return {
        ...response,
        data,
      };
    }, (error) => {
      if (axios.isAxiosError(error) && error.response) {
        error.response = {
          ...error.response,
          data: convertKeys.toCamel(error.response.data),
        };
      }

      return Promise.reject(error);
    },
  );
}
