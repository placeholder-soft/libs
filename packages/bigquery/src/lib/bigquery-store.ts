import * as bigquery from '@google-cloud/bigquery';
import type {
  InsertRowsOptions,
  TableMetadata,
} from '@google-cloud/bigquery/build/src/table';
import memoizee from 'memoizee';

export class BigQueryStore<
  U extends { [key: string]: U[keyof U] },
  T extends string
> {
  readonly bq: bigquery.BigQuery;
  constructor(
    private readonly config: { projectId: string; keyFilename?: string },
    private readonly datasetId: string,
    private readonly getBigQuerySchema: (
      tableName: T
    ) => TableMetadata['schema']
  ) {
    this.bq = new bigquery.BigQuery({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
    });
  }

  readonly ensureTable = memoizee(
    async (tableName: T) => {
      const dataset = this.bq.dataset(this.datasetId, {
        location: 'US',
      });
      const table = dataset.table(tableName);
      const tryCreate = async () => {
        const [datasetExists] = await dataset.exists();
        if (!datasetExists) {
          await dataset.create();
        }
        const [tableExists] = await table.exists();
        if (!tableExists) {
          const options: TableMetadata = {
            friendlyName: tableName,
            schema: this.getBigQuerySchema(tableName),
            timePartitioning: {
              type: 'DAY',
              field: 'created_at',
            },
          };
          await table.create(options);
        }
        return table;
      };

      try {
        return await tryCreate();
      } catch (e) {
        if (e instanceof Error) {
          console.warn(
            `Fail to create biquery table ${tableName}, will retry once, error: ${
              e.stack ?? e
            }`
          );
        }

        // Retry once in case that the table is created through another instance.
        return await tryCreate();
      }
    },
    {
      promise: true,
      maxAge: 60000,
    }
  );

  readonly insertRows = async (
    tableName: T,
    rows:
      | U[T]
      | {
          insertId: string;
          json: U[T];
        }[],
    options?: InsertRowsOptions
  ) => {
    return await (await this.ensureTable(tableName)).insert(rows, options);
  };

  readonly query = memoizee(async (sql: string) => {
    const options = {
      query: sql,
      location: 'US',
    };

    const [job] = await this.bq.createQueryJob(options);

    const [rows] = await job.getQueryResults();
    return rows as U[T];
  });
}
