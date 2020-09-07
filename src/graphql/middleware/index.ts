import type { MiddlewareFn } from 'type-graphql';

export const ErrorInterceptor: MiddlewareFn = async ({ context, info }, next) => {
  try {
    return await next();
  } catch (err) {
    // write error to file log
    console.error(err, context, info);
    throw err;
  }
};
