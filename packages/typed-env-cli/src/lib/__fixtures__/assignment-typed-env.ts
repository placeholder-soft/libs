import { typedEnv } from '@placeholdersoft/typed-env';

typedEnv('aaa').required().default('222').toString();
const aaa = typedEnv('eee').default('222').toString();

typedEnv('ccc')
.required()
.default('222')
.toString();

const nodeEnv = typedEnv('NODE_ENV')
  .optional()
  .default('development')
  .toString();

if (typedEnv('DATA_SYNC_NFT_ENABLED').default('true').toBoolean()) {
  startSyncNFT();
}
if (typedEnv('DATA_SYNC_TRADE_ENABLED').default('true').toBoolean()) {
  startSyncTrade();
}
if (typedEnv('DATA_SYNC_PYTH_ENABLED').default('true').toBoolean()) {
  startSyncPyth();
}

const databaseUrl = `postgresql://postgres:postgres@127.0.0.1:${typedEnv(
  'DOCKER_COMPOSE_POSTGRES_PORT',
)
  .required()
  .toString()}/${typedEnv('UNIWHALE_DB_NAME').required().toString()}`;

if (typedEnv(
  'if',
)){
  typedEnv(
    'if-block',
  )
} else if (typedEnv(
  'elseif',
)){
  typedEnv(
    'elseif-block',
  )
} else {
  typedEnv(
    'else-block',
  )
}

switch (typedEnv('swticch')){
  case typedEnv('swticch-case'): {
    typedEnv('swticch-case-block')
  }
  case typedEnv('swticch-case-2'): {
    typedEnv('swticch-case-2-block')
  }
  default: {
    typedEnv('swticch-default-block')
  }
}

do {
  typedEnv('do');
} while (typedEnv('while'));
