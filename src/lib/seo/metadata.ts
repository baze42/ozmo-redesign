import { getEnv } from '../config/env';
import { getRobotsForRoute } from './routes';

export type MetadataInput = {
  pathname: string;
  title: string;
  description: string;
  imagePath?: string;
};

export type MetadataResult = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: 'website';
    title: string;
    description: string;
    url: string;
    image: string;
  };
  twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
    image: string;
  };
};

function absoluteUrl(pathname: string) {
  const { PUBLIC_SITE_URL } = getEnv();
  const base = new URL(PUBLIC_SITE_URL);

  if (pathname === '/') {
    return `${base.origin}/`;
  }

  return new URL(pathname, base.origin).toString();
}

export function buildMetadata(input: MetadataInput): MetadataResult {
  const pageTitle =
    input.title === 'OZMO Digital' ? 'OZMO Digital' : `${input.title} | OZMO Digital`;
  const canonical = absoluteUrl(input.pathname);
  const image = absoluteUrl(input.imagePath ?? '/assets/og-default.png');
  const routePolicy = getRobotsForRoute(input.pathname);
  const robots = routePolicy.index ? 'index, follow' : 'noindex, nofollow';

  return {
    title: pageTitle,
    description: input.description,
    canonical,
    robots,
    openGraph: {
      type: 'website',
      title: pageTitle,
      description: input.description,
      url: canonical,
      image,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: input.description,
      image,
    },
  };
}
