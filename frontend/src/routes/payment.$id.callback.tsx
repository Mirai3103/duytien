import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/payment/$id/callback')({
  component: RouteComponent,
  loaderDeps: ({ search }: { search: any }) => ({ search }),
  loader: async ({ context, params,deps:{search}}) => {
    const { id } = params;
    const allowedMethods = ["momo", "vnpay"];
    if(!allowedMethods.includes(id)) {
      throw notFound();
    }
    const trpc = context.trpcClient;
    const result:any = await trpc.payment.callback.mutate({
      [id]: search,
    });
    if(!result.success) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
    throw redirect({
      to:"/order/$id/$status",
      params: {
        id: result.payment!.orderId.toString(),
        status: result.isPaymentSuccess ? "success" : "failed",
      },
      replace: true,
    });
  
    return {
      method: id,
    };
  },
})

function RouteComponent() {
  return <div>Hello "/paymant/$id/callback"!</div>
}
