import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const modes = await prisma.inOutwardMode.findMany({
            orderBy: { Sequence: "asc" },
        });
        return NextResponse.json(modes);
    } catch (error) {
        console.error("Error fetching modes:", error);
        return NextResponse.json({ error: "Failed to fetch modes" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const mode = await prisma.inOutwardMode.create({
            data: {
                InOutwardModeName: body.InOutwardModeName,
                IsActive: body.IsActive ?? true,
                Sequence: body.Sequence ? parseFloat(body.Sequence) : null,
                Remarks: body.Remarks,
                UserID: 1, // Placeholder
            },
        });
        return NextResponse.json(mode);
    } catch (error) {
        console.error("Error creating mode:", error);
        return NextResponse.json({ error: "Failed to create mode" }, { status: 500 });
    }
}
