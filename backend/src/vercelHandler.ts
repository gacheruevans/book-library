import { ApolloServer, HeaderMap } from '@apollo/server';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({ typeDefs, resolvers });
const serverStarted = server.start();

type VercelRequest = IncomingMessage & { body?: unknown };

export const handleGraphQL = async (
  req: VercelRequest,
  res: ServerResponse
): Promise<void> => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Apollo-Require-Preflight');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  await serverStarted;

  const headers = new HeaderMap();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
  }

  const queryIndex = req.url?.indexOf('?') ?? -1;
  const response = await server.executeHTTPGraphQLRequest({
    httpGraphQLRequest: {
      method: req.method ?? 'GET',
      headers,
      search: queryIndex === -1 ? '' : req.url!.slice(queryIndex),
      body: req.body,
    },
    context: async () => ({}),
  });

  for (const [key, value] of response.headers) {
    res.setHeader(key, value);
  }
  res.statusCode = response.status ?? 200;

  if (response.body.kind === 'complete') {
    res.end(response.body.string);
    return;
  }

  for await (const chunk of response.body.asyncIterator) {
    res.write(chunk);
  }
  res.end();
};
