import path from 'path';
import { BigQueryStore } from '../bigquery-store';
import {
  getBigQuerySchemaByTikTok,
  TikTokPageModels,
} from '../__fixtures__/tiktok-models';

const keyFilename = path.resolve(
  __dirname,
  '../__fixtures__/shopify-cloud-0-55a469e24366.json'
);

const projectId = 'shopify-cloud-0';
const datasetId = 'tiktok_appstore';

describe('BigQueryStore', () => {
  test('create dataset', () => {
    const store = new BigQueryStore<TikTokPageModels>(
      {
        projectId,
        keyFilename,
      },
      datasetId,
      getBigQuerySchemaByTikTok
    );

    store.ensureDataset();

    store.insertRows('topic', {
      data: [],
    });
    // const rows = store.query('');
  });
});
