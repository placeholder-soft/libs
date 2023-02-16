import { typedEnv } from '@placeholdersoft/typed-env';


typedEnv('aaa').required().default('222').toString()
const aaa = typedEnv('eee').default('222').toString();

typedEnv('ccc')
    .required()
    .default('222')
    .toString();
