import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const outwards = await prisma.outward.findMany({
            orderBy: { OutwardDate: "desc" },
            take: 50,
        });
        return NextResponse.json(outwards);
    } catch (error) {
        console.error("Error fetching outward entries:", error);
        return NextResponse.json({ error: "Failed to fetch outward entries" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const outward = await prisma.outward.create({
            data: {
                OutwardNo: body.OutwardNo,
                OutwardDate: new Date(body.OutwardDate),
                Subject: body.Subject,
                Remarks: body.Description,
                LetterNo: body.OutwardLetterNo,
                LetterDate: body.OutwardLetterDate ? new Date(body.OutwardLetterDate) : null,
                FromInwardOutwardOfficeID: parseInt(body.FromInwardOutwardOfficeID) || 1,
                InOutwardModeID: body.InOutwardModeID ? parseInt(body.InOutwardModeID) : null,
                FinYearID: 1,
                UserID: 1,
            },
        });
        return NextResponse.json(outward);
    } catch (error) {
        console.error("Error creating outward entry:", error);
        return NextResponse.json({ error: "Failed to create outward entry" }, { status: 500 });
    }
}
