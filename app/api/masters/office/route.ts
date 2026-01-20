import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const offices = await prisma.inwardOutwardOffice.findMany({
            orderBy: { Created: "desc" },
        });
        return NextResponse.json(offices);
    } catch (error) {
        console.error("Error fetching offices:", error);
        return NextResponse.json({ error: "Failed to fetch offices" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const office = await prisma.inwardOutwardOffice.create({
            data: {
                OfficeName: body.OfficeName,
                InstituteID: parseInt(body.InstituteID),
                DepartmentID: body.DepartmentID ? parseInt(body.DepartmentID) : null,
                OpeningDate: new Date(body.OpeningDate),
                OpeningInwardNo: parseInt(body.OpeningInwardNo),
                OpeningOutwardNo: parseInt(body.OpeningOutwardNo) || 1,
                UserID: 1, // Placeholder for authenticated user ID
            },
        });
        return NextResponse.json(office);
    } catch (error) {
        console.error("Error creating office:", error);
        return NextResponse.json({ error: "Failed to create office" }, { status: 500 });
    }
}
