import path from 'path';
import { BigQueryStore } from '../bigquery-store';
import { getBigQuerySchemaByTikTok } from '../__fixtures__/tiktok-models';

const keyFilename = path.resolve(
  __dirname,
  '../__fixtures__/shopify-cloud-0-55a469e24366.json'
);

const projectId = 'shopify-cloud-0';
const datasetId = 'tiktok_appstore';

describe('BigQueryStore', () => {
  test('create dataset', () => {
    const store = new BigQueryStore(
      {
        projectId,
        keyFilename,
      },
      datasetId,
      getBigQuerySchemaByTikTok
    );

    store.ensureDataset();
  });
});
