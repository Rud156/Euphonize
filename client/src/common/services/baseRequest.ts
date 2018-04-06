import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL } from '../utils/constants';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
class BaseRequest {
  httpClient: HttpClient;

  constructor(private ea: EventAggregator) {
    this.httpClient = new HttpClient();
    this.httpClient.configure(config => {
      config.withBaseUrl(BASE_URL).withDefaults({
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'Fetch',
        },
      });
    });
  }

  getDataFromService = (generatedURL: string, errorMessage?: string) => {
    return this.httpClient
      .fetch(generatedURL)
      .then(response => response.json())
      .catch(error => {
        this.ea.publish('notification', {
          type: 'error',
          message: errorMessage ? errorMessage : 'Yikes!! We were unable to load the data.',
          date: error,
        });

        return { success: false };
      });
  };

  putDataIntoService = (
    generatedURL: string,
    data: any,
    methodType: 'POST' | 'PUT',
    errorMessage?: string
  ) => {
    return this.httpClient
      .fetch(generatedURL, {
        body: JSON.stringify(data),
        method: methodType,
      })
      .then(response => response.json())
      .catch(error => {
        this.ea.publish('notification', {
          type: 'error',
          message: errorMessage ? errorMessage : 'Yikes!! We were unable to load the data.',
          date: error,
        });

        return { success: false };
      });
  };
}

export default BaseRequest;
