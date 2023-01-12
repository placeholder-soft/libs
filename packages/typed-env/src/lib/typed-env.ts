import { Dict, EnvBox } from './env-box';

/**
 * default env source is process.env, if you want to use other env source, you can use injectGlobalEnv
 */
let __GLOBAL_ENV__ = process?.env ?? {};

/**
 * Set the global environment for the current process.
 *
 * @param env The environment to set.
 * @example injectGlobalEnv(process.env) | injectGlobalEnv({"app_version": "0.0.1"})
 *
 */
export const injectGlobalEnv = (env: Dict<string>) => {
  __GLOBAL_ENV__ = env;
};

/**
 *
 * @param key env key
 * @returns EnvBox
 *
 * @description support evn-name type check, default env source is process.env, if you want to use other env source, you can use injectGlobalEnv
 *
 */
export function typedEnv<T extends string>(key: T) {
  return EnvBox.of(key, __GLOBAL_ENV__);
}

/**
 * @param key env key
 * @returns EnvBox
 *
 * @description can be any env-name, default env source is process.env, if you want to use other env source, you can use injectGlobalEnv
 */
export function anyEnv(key: string) {
  return EnvBox.of(key, __GLOBAL_ENV__);
}
