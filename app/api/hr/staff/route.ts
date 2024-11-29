import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const students = await prisma.staff.findMany();
  return NextResponse.json(students);
}

export async function POST(request: { json: () => any; }) {
  const studentData = await request.json();
  const student = await prisma.staff.create({
    data: studentData,
  });
  return NextResponse.json(student, { status: 201 });
}
