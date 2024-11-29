import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: any) {
  const { uuid } = params;
  const student = await prisma.staff.findUnique({ where: { id: Number(uuid) } });
  
  if (!student) {
    return NextResponse.json({ error: 'Personal not found' }, { status: 404 });
  }

  return NextResponse.json(student);
}

export async function PUT(request: Request, { params }: any) {
  const { uuid } = params;
  const updatedData = await request.json();
  const staff = await prisma.staff.update({
    where: { id: Number(uuid) },
    data: updatedData,
  });
  
  return NextResponse.json(staff);
}

export async function DELETE(request: Request, { params }: any) {
  const { uuid } = params;
  await prisma.staff.delete({ where: { id: Number(uuid) } });
  return NextResponse.json({ message: 'Personal deleted' }, { status: 204 });
}
