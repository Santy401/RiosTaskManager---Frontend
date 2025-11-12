import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.customFilter.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('Error deleting filter:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
