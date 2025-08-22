import { createClient } from 'contentful';

// Type guard to check if env vars are defined
const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  throw new Error('Contentful Space ID and Access Token must be defined');
}

export const client = createClient({
  space: space,
  accessToken: accessToken,
});