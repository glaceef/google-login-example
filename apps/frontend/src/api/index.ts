import { Api } from '@/api/api';
import { Campaign } from '@/models/campaign';
import { UrlResponse } from './api_response';

export interface Paging {offset?: number, limit?: number, withCountFlag: boolean}

export class Client extends Api {
  constructor() {
    super();
  }

  async getLoginUrl() {
    const result = await this.requestData({
      method: 'get',
      url: `/login`,
    }, UrlResponse);

    return result.url;
  }

  async getCampaign(campaignUuid: string) {
    const result = await this.requestData({
      method: 'get',
      url: `/v1/campaigns/${campaignUuid}`,
    }, Campaign);

    return result;
  }
}

export const client = new Client();
