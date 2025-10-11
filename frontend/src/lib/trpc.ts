import type { AppRouter } from '../../../backend/dist-types/trpc/index';
import { createTRPCContext ,createTRPCOptionsProxy} from '@trpc/tanstack-react-query';
export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
