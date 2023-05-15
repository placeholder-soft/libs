import path from 'path';
import { BigQueryStore } from '../bigquery-store';
import {
  getBigQuerySchemaByYouTuBe,
  YouTuBePageModels,
} from '../__fixtures__/models';

const keyFilename = path.resolve(
  __dirname,
  '../__fixtures__/gcr-key-file.json'
);

const projectId = 'shopify-cloud-0';
const datasetId = 'crawler';

describe('BigQueryStore', () => {
  test('create dataset', async () => {
    const store = new BigQueryStore<YouTuBePageModels>(
      {
        projectId,
        keyFilename,
      },
      datasetId,
      getBigQuerySchemaByYouTuBe
    );

    jest.setTimeout(10000);

    const aaa = await store.queryTable('videos', {
      selectedFields: 'title'
    });
    console.log(aaa.length);
    // store.ensureDataset();

    // store.insertRows('topic', {
    //   data: [],
    // });
    // const rows = await store.query(`
    // select * from crawler.videos limit 2
    // `);

    // console.log(rows);
  });
});
