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
