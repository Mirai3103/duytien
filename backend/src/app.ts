import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { router } from './server/trpc';
import { appRouter } from './db/trpc';
 

const server = createHTTPServer({
  router: appRouter,
});
 
server.listen(3000);