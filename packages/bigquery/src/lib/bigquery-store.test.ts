import { randomUUID } from 'crypto';
import {
  capitalize,
  randomString,
  randomIntegerInRange,
} from '@placeholdersoft/helpers';
import path from 'path';
import { BigQueryStore } from './bigquery-store';
import {
  getBigQuerySchemaByTikTok,
  TikTokSitemapPageModel,
  TikTokPageModels,
  TikTokModelName,
} from './__fixtures__/tiktok-models';

const keyFilename = path.resolve(
  __dirname,
  '__fixtures__/shopify-cloud-0-55a469e24366.json'
);

const projectId = 'shopify-cloud-0';
const datasetId = 'tiktok_appstore';

describe('bigquery store', () => {
  const store = new BigQueryStore<TikTokPageModels, TikTokModelName>(
    {
      projectId,
      keyFilename,
    },
    datasetId,
    getBigQuerySchemaByTikTok
  );

  it('ensure dataset', async () => {
    await store.ensureDataset();
  });

  it('del dataset', async () => {
    await store.deleteDataset(true);
  });

  it('ensure table', async () => {
    await store.ensureTable('sitemap');
  });

  it('del table', async () => {
    await store.deleteTable('sitemap');
  });

  it('should work', async () => {
    await store.ensureTable('sitemap');

    const sitemapRows: TikTokSitemapPageModel[] = new Array(1)
      .fill(null)
      .map((_) => ({
        title: capitalize(randomString(randomIntegerInRange(10, 5))),
        url: `/${capitalize(randomString(randomIntegerInRange(10, 5)))}`,
        pathname: capitalize(randomString(randomIntegerInRange(10, 5))),
        nanoid: randomUUID(),
        created_at: new Date(),
        topics: [
          {
            topic: capitalize(randomString(randomIntegerInRange(10, 5))),
            url: `/${capitalize(randomString(randomIntegerInRange(10, 5)))}`,
          },
        ],
        accounts: [
          {
            name: capitalize(randomString(randomIntegerInRange(10, 5))),
            url: `/${capitalize(randomString(randomIntegerInRange(10, 5)))}`,
          },
        ],
        tags: [
          {
            tag: capitalize(randomString(randomIntegerInRange(10, 5))),
            url: `/${capitalize(randomString(randomIntegerInRange(10, 5)))}`,
          },
        ],
      }));

    const rows = sitemapRows.map((r) => ({
      insertId: r.nanoid,
      json: r,
    }));

    await store.insertRows('sitemap', rows, {
      skipInvalidRows: true,
      createInsertId: false,
      raw: true,
    });

    const result = await store.query(
      `select * from ${projectId}.${datasetId}.sitemap`
    );
    console.log(result);
  });
});
