import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const inwards = await prisma.inward.findMany({
            orderBy: { InwardDate: "desc" },
            take: 50,
        });
        return NextResponse.json(inwards);
    } catch (error) {
        console.error("Error fetching inward entries:", error);
        return NextResponse.json({ error: "Failed to fetch inward entries" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const inward = await prisma.inward.create({
            data: {
                InwardNo: body.InwardNo,
                InwardDate: new Date(body.InwardDate),
                Subject: body.Subject,
                Remarks: body.Description,
                CourierCompanyName: body.CourierCompanyName,
                InwardLetterNo: body.InwardLetterNo,
                InwardLetterDate: body.InwardLetterDate ? new Date(body.InwardLetterDate) : null,
                ToInwardOutwardOfficeID: parseInt(body.ToInwardOutwardOfficeID) || 1,
                InOutwardModeID: body.InOutwardModeID ? parseInt(body.InOutwardModeID) : null,
                FinYearID: 1,
                UserID: 1,
            },
        });
        return NextResponse.json(inward);
    } catch (error) {
        console.error("Error creating inward entry:", error);
        return NextResponse.json({ error: "Failed to create inward entry" }, { status: 500 });
    }
}
