import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

const usersRoute = router({
  getMyProfile: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
    return ctx.session.user;
  }),
});
export { usersRoute };
