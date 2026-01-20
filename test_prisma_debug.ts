import "dotenv/config";
import { PrismaClient } from "@prisma/client";

async function main() {
    console.log("DEBUG: DATABASE_URL is", process.env.DATABASE_URL ? "DEFINED" : "UNDEFINED");
    if (process.env.DATABASE_URL) {
        console.log("DEBUG: DATABASE_URL length:", process.env.DATABASE_URL.length);
    }

    // Attempt 1: datasources
    try {
        console.log("Attempt 1: datasources");
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        } as any);
        console.log("Success with datasources");
        await prisma.$disconnect();
        return;
    } catch (e: any) {
        console.log("Failed 1:", e.message);
    }

    // Attempt 2: datasourceUrl
    try {
        console.log("Attempt 2: datasourceUrl");
        const prisma = new PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        } as any);
        console.log("Success with datasourceUrl");
        await prisma.$disconnect();
        return;
    } catch (e: any) {
        console.log("Failed 2:", e.message);
    }

    // Attempt 3: plain constructor
    try {
        console.log("Attempt 3: plain constructor (default)");
        const prisma = new PrismaClient();
        console.log("Success with plain constructor");
        // Verify connection?
        // await prisma.$connect();
        await prisma.$disconnect();
        return;
    } catch (e: any) {
        console.log("Failed 3:", e.message);
    }
}

main();
