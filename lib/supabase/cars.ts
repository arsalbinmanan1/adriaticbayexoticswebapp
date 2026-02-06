import { createClient } from './client'
import { createAdminClient } from './admin'

export interface DbCar {
    id: string
    make: string
    model: string
    year: number
    vin: string
    license_plate: string
    category: string
    slug: string
    description: string
    exterior_color: string
    interior_color: string
    daily_rate: number
    four_hour_rate?: number
    weekly_rate?: number
    monthly_rate?: number
    security_deposit: number
    status: 'available' | 'booked' | 'maintenance' | 'inactive'
    current_location: string
    images: string[]
    features: string[]
    specifications: {
        engine?: string
        horsepower?: string
        acceleration?: string
        topSpeed?: string
        transmission?: string
        drivetrain?: string
    }
    created_at: string
    updated_at?: string
    deleted_at?: string
}

/**
 * Maps a database car object to the frontend Car interface format.
 */
export function mapDbCarToInterface(dbCar: DbCar) {
    return {
        id: dbCar.id,
        name: `${dbCar.make} ${dbCar.model}`,
        slug: dbCar.slug,
        brand: dbCar.make,
        model: dbCar.model,
        year: dbCar.year,
        category: dbCar.category as any,
        pricing: {
            perDay: Number(dbCar.daily_rate),
            fourHours: dbCar.four_hour_rate ? Number(dbCar.four_hour_rate) : undefined,
            deposit: Number(dbCar.security_deposit),
        },
        colors: {
            exterior: dbCar.exterior_color || 'Not specified',
            interior: dbCar.interior_color || 'Not specified',
        },
        images: {
            main: dbCar.images[0] || '',
            gallery: dbCar.images,
        },
        specs: {
            engine: dbCar.specifications?.engine || 'N/A',
            horsepower: dbCar.specifications?.horsepower || 'N/A',
            acceleration: dbCar.specifications?.acceleration || 'N/A',
            topSpeed: dbCar.specifications?.topSpeed || 'N/A',
            transmission: dbCar.specifications?.transmission || 'N/A',
            drivetrain: dbCar.specifications?.drivetrain || 'N/A',
        },
        features: dbCar.features || [],
        description: dbCar.description,
        detailedDescription: {
            vibe: dbCar.description, // Use description as vibe
            highlights: dbCar.features.slice(0, 3), // Use first 3 features as highlights
        },
        available: dbCar.status === 'available',
    }
}

/**
 * Fetches all active cars from the database.
 * Orders: Corvette C8-R, McLaren 570S, Maserati Levante first, then others by price.
 */
export async function getAllCars() {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('cars')
        .select('*')
        .is('deleted_at', null)
        .in('status', ['available', 'booked'])

    if (error) {
        console.error('Error fetching cars:', error)
        return []
    }

    // Custom ordering: Corvette, McLaren 570S, Maserati first
    const priorityOrder = ['corvette-c8-r', 'mclaren-570s', 'maserati-levante']
    const sortedData = (data as DbCar[]).sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.slug)
        const bIndex = priorityOrder.indexOf(b.slug)
        
        // If both are in priority list, sort by priority
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
        // If only a is in priority list, it comes first
        if (aIndex !== -1) return -1
        // If only b is in priority list, it comes first
        if (bIndex !== -1) return 1
        // Otherwise, sort by price descending
        return b.daily_rate - a.daily_rate
    })

    return sortedData.map(mapDbCarToInterface)
}

/**
 * Fetches a single car by its slug.
 */
export async function getCarBySlug(slug: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error(`Error fetching car with slug ${slug}:`, error)
        return null
    }

    return mapDbCarToInterface(data as DbCar)
}
