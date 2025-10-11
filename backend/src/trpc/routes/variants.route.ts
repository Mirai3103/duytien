import z from "zod";
import { publicProcedure, router } from "../trpc";
import db from "@/db";
import { eq } from "drizzle-orm";
import { productVariants, productVariantValues } from "@/db/schema";




export const variantsRoute = router({
  getVariants: publicProcedure.input(z.number()).query(async ({ input }) => {
    console.log(input);
    return await db.query.productVariants.findMany({  
      columns:{
        metadata:false
      },
      where: eq(productVariants.productId, input),
      with:{
        variantValues:{
          with:{
            value:{
              with:{
                attribute:true
              }
            }
          }
        }
      }
    });
  }),
});
