import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";

// 1. Absolute Path Resolution (绝对路径寻址): Accurately target the .env file in the root directory
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// 2. Failsafe (防呆机制/防御性编程): If it fails to load, throw a loud error immediately
if (!process.env.DATABASE_URL) {
  throw new Error(`[CRITICAL ERROR] Cannot find DATABASE_URL! Please check if the .env file exists at this exact path: ${envPath}`);
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // ⚠️ PRISMA V7 HACK: 
    // Since directUrl is gone, and this config is used by the CLI for migrations,
    // we explicitly feed the CEO (port 5432) into the standard url field.
    url: process.env.DIRECT_URL,
  },
});