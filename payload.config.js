import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    bundler: "webpack",
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL ||
        "postgresql://user:pass@localhost:5432/final",
    },
  }),
  collections: [
    // Add your collections here
  ],
  typescript: {
    outputFile: "payload-types.ts",
  },
});
