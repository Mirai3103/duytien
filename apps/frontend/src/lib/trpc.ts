import type { AppRouter } from "@f5tech/backend/trpc";

import { createTRPCContext } from "@trpc/tanstack-react-query";
export const { TRPCProvider, useTRPC, useTRPCClient } =
	createTRPCContext<AppRouter>();
