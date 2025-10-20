export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("@better-auth/core/db/adapter").DBAdapter<import("better-auth").BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
    };
    socialProviders: {
        google: {
            enabled: true;
            clientId: string;
            clientSecret: string;
        };
    };
    trustedOrigins: string[];
}>;
