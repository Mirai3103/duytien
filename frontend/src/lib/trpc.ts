import type { AppRouter } from "@backend/trpc";

import { createTRPCContext } from "@trpc/tanstack-react-query";
export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
