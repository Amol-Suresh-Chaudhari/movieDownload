import { pathToFileURL } from 'url';
import { resolve as resolvePath } from 'path';

export async function resolve(specifier, context, defaultResolve) {
  const { parentURL = null } = context;

  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    return {
      url: pathToFileURL(resolvePath(new URL(parentURL).pathname, '..', specifier)).href
    };
  }

  return defaultResolve(specifier, context, defaultResolve);
}
