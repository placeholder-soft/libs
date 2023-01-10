import { EnvBox } from "./env-box";

/**
 * @param key env key
 * @returns EnvBox
 */
export function typedEnv<T extends string>(key: T) {
  return EnvBox.of(key);
}

/**
 * @param key env key
 * @returns EnvBox
 */
export function anyEnv(key: string) {
  return EnvBox.of(key);
}
