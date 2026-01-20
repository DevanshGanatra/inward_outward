import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const couriers = await prisma.courierCompany.findMany({
            orderBy: { Created: "desc" },
        });
        return NextResponse.json(couriers);
    } catch (error) {
        console.error("Error fetching couriers:", error);
        return NextResponse.json({ error: "Failed to fetch couriers" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const courier = await prisma.courierCompany.create({
            data: {
                CourierCompanyName: body.CourierCompanyName,
                ContactPersonName: body.ContactPersonName,
                DefaultRate: body.DefaultRate ? parseFloat(body.DefaultRate) : null,
                PhoneNo: body.PhoneNo,
                Email: body.Email,
                Address: body.Address,
                UserID: 1, // Placeholder
            },
        });
        return NextResponse.json(courier);
    } catch (error) {
        console.error("Error creating courier:", error);
        return NextResponse.json({ error: "Failed to create courier" }, { status: 500 });
    }
}
