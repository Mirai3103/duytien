import db from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL!],
});

async function initAdminIfNotExists() {
  let admin = await db.query.user.findFirst({
    where: eq(user.email, "admin@admin.com"),
  });

  if (!admin) {
    await auth.api.signUpEmail({
      body: {
        email: "admin@admin.com",
        password: "admin@123",
        name: "Admin",
      },
    });
  await db.update(user).set({
    role: "admin",
    emailVerified: true,
  }).where(eq(user.email, "admin@admin.com"));
  }
  admin = await db.query.user.findFirst({
    where: eq(user.email, "admin@admin.com"),
  });

}
initAdminIfNotExists();