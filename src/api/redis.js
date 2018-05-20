import * as BPromise from 'bluebird';
import * as redis from 'redis';

BPromise.promisifyAll(redis.RedisClient.prototype);
BPromise.promisifyAll(redis.Multi.prototype);

const defaults = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
};

export function create(opts = {}) {
  return redis.createClient({ ...defaults, ...opts });
}

