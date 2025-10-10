import { publicProcedure, router } from './trpc';
 
export const appRouter = router({
    userList: publicProcedure
    .query(async () => {
     
      return {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
      };
    }),
});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;