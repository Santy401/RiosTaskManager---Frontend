import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entity = searchParams.get('entity')

    if (!entity) {
      return NextResponse.json({ error: 'Entity required' }, { status: 400 })
    }

    const filters = await prisma.customFilter.findMany({
      where: { entity },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        field: true,
        value: true,
        entity: true,
        createdAt: true
      }
    })

    // Si no hay filtros, devolver array vacío
    return NextResponse.json(filters || [])
  } catch (error) {
    console.error('Error fetching filters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filters', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Crear filtro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, field, value, entity } = body

    // Validar campos requeridos
    if (!name || !field || !value || !entity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verificar si ya existe un filtro con el mismo nombre para esta entidad
    const existingFilter = await prisma.customFilter.findUnique({
      where: {
        name_entity: {
          name: name.trim(),
          entity
        }
      }
    })

    // Si ya existe, devolver el existente
    if (existingFilter) {
      return NextResponse.json(existingFilter, { status: 200 })
    }

    // Crear nuevo filtro
    const newFilter = await prisma.customFilter.create({
      data: {
        name: name.trim(),
        field,
        value: value.trim(),
        entity
      }
    })

    return NextResponse.json(newFilter, { status: 201 })
  } catch (error) {
    console.error('Error creating filter:', error)
    return NextResponse.json(
      { error: 'Failed to create filter', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
