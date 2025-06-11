import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { user } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  checkIfUserExists: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const isUserExists = await ctx.db.query.user.findFirst({
        where: eq(user.email, input.email),
      });
      console.log(!!isUserExists);
      return !!isUserExists;
    }),
});
