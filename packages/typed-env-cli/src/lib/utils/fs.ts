import fs from 'fs';
import path from 'path';

const checkPath = (pth: string) => {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(
      pth.replace(path.parse(pth).root, '')
    );

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`);
      throw error;
    }
  }
};

type Option = { mode?: number | undefined } | number;

const getMode = (options?: Option) => {
  const defaults = { mode: 0o777 };
  if (typeof options === 'number') return options;
  return { ...defaults, ...options }.mode;
};

export const ensureDirSync = (dir: string, options?: Option) => {
  checkPath(dir);

  return fs.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true,
  });
};
