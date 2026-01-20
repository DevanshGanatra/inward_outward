import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [totalInward, totalOutward, recentInwards, recentOutwards, activeOffices] = await Promise.all([
            prisma.inward.count(),
            prisma.outward.count(),
            prisma.inward.findMany({
                orderBy: { InwardDate: "desc" },
                take: 5,
            }),
            prisma.outward.findMany({
                orderBy: { OutwardDate: "desc" },
                take: 5,
            }),
            prisma.inwardOutwardOffice.count(),
        ]);

        // Format recent traffic
        const recentTraffic = [
            ...recentInwards.map((i) => ({
                id: `in-${i.InwardID}`,
                type: "Inward",
                subject: i.Subject,
                time: new Date(i.Created).toLocaleTimeString(),
                status: "Completed",
            })),
            ...recentOutwards.map((o) => ({
                id: `out-${o.OutwardID}`,
                type: "Outward",
                subject: o.Subject,
                time: new Date(o.Created).toLocaleTimeString(),
                status: "Sent",
            })),
        ].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 10);

        return NextResponse.json({
            stats: {
                totalInward,
                totalOutward,
                pendingItems: 0, // Placeholder
                activeOffices,
            },
            recentTraffic,
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
