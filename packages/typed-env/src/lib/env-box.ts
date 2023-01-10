import * as process from "process";

type EnvBoxValueType = string | undefined;
type DefinedAs<T, U> = T extends undefined ? U | undefined : U;

export class EnvBox<T extends EnvBoxValueType> {
  constructor(readonly name: string, private readonly value: T) {}

  required() {
    if (this.value == null) {
      throw new Error(
        `Required env variable for name: ${this.name} is not set`
      );
    }
    return new EnvBox(this.name, this.value);
  }

  optional() {
    return new EnvBox(this.name, this.value);
  }

  default(value: string) {
    return new EnvBox(this.name, this.value ?? value);
  }
  nonEmpty() {
    if (this.value == null || this.value === "") {
      throw new Error(`Env variable for name: ${this.name} is empty`);
    }
    return new EnvBox(this.name, this.value);
  }
  toBoolean() {
    const value = this.value;
    if (value === "true" || value === "TRUE") {
      return true;
    }
    if (value === "false" || value === "FALSE") {
      return false;
    }

    throw new Error(
      `Env variable for name: ${this.name} is not boolean, value: ${value}`
    );
  }

  toInt(radix?: number): DefinedAs<T, number> {
    const value = this.toString();
    if (value == null) {
      return undefined as unknown as DefinedAs<T, number>;
    }
    const val = parseInt(value, radix);
    if (isNaN(val)) {
      throw new Error(`Env variable for name: ${this.name} is not an integer`);
    }
    return val;
  }

  toString() {
    return this.value;
  }

  static of<T extends string>(name: T) {
    const val = process.env[name];
    return new EnvBox(name, val);
  }
}
