import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const schools = await prisma.subscriptionPlan.findMany({
            orderBy: {
                name: 'desc' // Trier par date de mise à jour
            }
        });
        return NextResponse.json(schools, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Erreur lors de la récupération des plans de souscription." },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const { name, price, description } = await req.json();

        // Validation basique
        if (!name || !price) {
            return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
        }

        // Création du plan de souscription dans la base de données
        const plan = await prisma.subscriptionPlan.create({
            data: {
                name,
                price: parseFloat(price), // Assurez-vous que le prix est bien un nombre
                description,
            },
        });

        return NextResponse.json(plan, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while creating the subscription plan" },
            { status: 500 }
        );
    }
}
