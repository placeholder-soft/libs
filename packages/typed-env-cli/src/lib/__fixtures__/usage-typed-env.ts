import { typedEnv } from '@placeholdersoft/typed-env';

typedEnv('bbb').required().default('111').toInt(111);
typedEnv('bbb').default('222').required().toInt(222);
typedEnv('bbb').default('333').required().toInt(333);
typedEnv('bbb').default('333').required().toString();

typedEnv('ccc').required().default('111').toInt(111);
typedEnv('ccc').default('222').required().toInt(222);
typedEnv('ccc').default('333').required().toInt(333);
typedEnv('ccc').default('333').required().toString();

typedEnv('ddd');

typedEnv('eee').default('');

// typedEnv("");typedEnv("bbb").required().toInt(111);typedEnv("bbb").required().toInt(222);

// typedEnv("bbb").required().toInt(111);typedEnv("bbb").required().toInt(111);
// typedEnv("bbb").required().toInt(111);
// typedEnv().required().toInt();
// typedEnv("");
// typedEnv("ccc").required().toInt(222);
