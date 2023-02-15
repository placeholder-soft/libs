import { sample } from "./arrayHelpers";
import { randomIntegerInRange, randomNumber } from "./numberHelpers";
import { OneOrMore } from "./types";

export const capitalize = (s: string): string =>
  s === "" ? "" : s[0]!.toUpperCase() + s.slice(1);

export function idFactory(prefix: string, separator = "/"): () => string {
  let id = 0;
  return () => {
    id += 1;
    return prefix + separator + id.toString();
  };
}

const randomImageUrlSeed = idFactory("randomImageUrlSeed", "-");
export function randomImageUrl(
  options: { size?: { width: number; height: number } } = {}
): string {
  let res = "https://picsum.photos/seed/" + randomImageUrlSeed();

  if (options.size != null) {
    res += `/${options.size.width}/${options.size.height}`;
  }

  return res;
}

export function randomAvatarUrl(userId: string): string {
  return `https://i.pravatar.cc/500?u=${userId}`;
}

export function randomAlphabet(): string {
  return String.fromCharCode(randomIntegerInRange(0x7a, 0x61));
}

export function randomWord(length = randomIntegerInRange(10, 3)): string {
  return randomString(length);
}

export function randomSentence(): string {
  return randomString(randomIntegerInRange(100, 10), [
    () =>
      sample([
        () => randomWord(randomIntegerInRange(5, 3)),
        () => randomWord(randomIntegerInRange(5, 3)),
        () => randomWord(randomIntegerInRange(6, 3)),
        () => randomWord(randomIntegerInRange(7, 3)),
        () => randomWord(),
      ])() + " ",
  ]);
}

export function randomReactionEmoji(): string {
  return String.fromCodePoint(randomIntegerInRange(0x1f64f, 0x1f600));
}

export function randomString(
  length: number,
  generators: OneOrMore<() => string> = [randomAlphabet]
): string {
  return Array.from({ length }, () => sample(generators)()).join("");
}

export function randomEmail(): string {
  return `${randomString(randomIntegerInRange(10, 4))}@${randomString(
    randomIntegerInRange(4, 2)
  )}.com`;
}

export function randomPhoneNumber(): string {
  return `+1${randomNumber("511111312".length)}`;
}
