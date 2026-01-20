import "dotenv/config";
import { PrismaClient } from "@prisma/client";

async function main() {
    console.log("Testing Prisma Client instantiation...");
    try {
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });

        console.log("Prisma Client instantiated successfully.");
        // Try a connection?
        // await prisma.$connect(); 
        // console.log("Connected successfully.");
    } catch (e) {
        console.error("Failed to instantiate:", e);
        process.exit(1);
    }
}

main();
