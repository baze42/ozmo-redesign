import { getEnv, type AppEnv } from '../config/env';

import {
  createWordPressClient,
  type WordPressClient,
} from './client';
import {
  fixturePosts,
  fixtureServices,
  fixtureTransformations,
} from './fixtures';
import type {
  PostViewModel,
  ServiceViewModel,
  TransformationViewModel,
} from './mappers';

type BuildContentEnv = Pick<
  AppEnv,
  'WORDPRESS_API_BASE_URL' | 'PRODUCTION_LAUNCH_APPROVED' | 'OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES'
>;

type BuildContentOptions = {
  env?: BuildContentEnv;
  wordpress?: Partial<WordPressClient>;
};

export function shouldUseLocalWordPressFixtures(env: BuildContentEnv): boolean {
  return (
    env.OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES &&
    process.env.VERCEL !== '1' &&
    env.WORDPRESS_API_BASE_URL.trim() === '' &&
    !env.PRODUCTION_LAUNCH_APPROVED
  );
}

export async function getBuildServices(
  options: BuildContentOptions = {},
): Promise<ServiceViewModel[]> {
  const env = resolveBuildContentEnv(options.env);

  if (options.wordpress?.getServices) {
    return options.wordpress.getServices();
  }

  if (shouldUseLocalWordPressFixtures(env)) {
    return fixtureServices;
  }

  return createDefaultWordPressClient(env).getServices();
}

export async function getBuildTransformations(
  options: BuildContentOptions = {},
): Promise<TransformationViewModel[]> {
  const env = resolveBuildContentEnv(options.env);

  if (options.wordpress?.getTransformations) {
    return options.wordpress.getTransformations();
  }

  if (shouldUseLocalWordPressFixtures(env)) {
    return fixtureTransformations;
  }

  return createDefaultWordPressClient(env).getTransformations();
}

export async function getBuildPosts(options: BuildContentOptions = {}): Promise<PostViewModel[]> {
  const env = resolveBuildContentEnv(options.env);

  if (options.wordpress?.getPublishedPosts) {
    return options.wordpress.getPublishedPosts();
  }

  if (shouldUseLocalWordPressFixtures(env)) {
    return fixturePosts;
  }

  return createDefaultWordPressClient(env).getPublishedPosts();
}

export function getBlogIndexRobots(posts: Array<unknown>) {
  return posts.length >= 3 ? 'index, follow' : 'noindex, follow';
}

function resolveBuildContentEnv(env?: BuildContentEnv): BuildContentEnv {
  if (env) {
    return env;
  }

  const currentEnv = getEnv();

  return {
    WORDPRESS_API_BASE_URL: currentEnv.WORDPRESS_API_BASE_URL,
    PRODUCTION_LAUNCH_APPROVED: currentEnv.PRODUCTION_LAUNCH_APPROVED,
    OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: currentEnv.OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES,
  };
}

function createDefaultWordPressClient(env: BuildContentEnv): WordPressClient {
  return createWordPressClient({
    apiBaseUrl: env.WORDPRESS_API_BASE_URL,
    productionLaunchApproved: env.PRODUCTION_LAUNCH_APPROVED,
  });
}
