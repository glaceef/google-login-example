// API の戻り値を一時受けするためのインターフェイス
export interface ApiResponse {
  resultCode: string;
  message?: string;
  messages?: string[];
  details?: {
    key: string,
    message: string
  }[];
}

export class UrlResponse {
  url!: string;
}

export interface ApiDataResponse<T> extends ApiResponse {
  data: T;
}

export interface ApiDataListResponse<T> extends ApiResponse {
  data:  {
    items: T[],
    count?: number
  }
}
