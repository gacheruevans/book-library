import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  const port = Number(process.env.PORT) || 4000;
  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at: ${url}`);
})();