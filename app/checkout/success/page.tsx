import React from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

type Props = {
  searchParams?: { bookingId?: string }
}

export default async function SuccessPage({ searchParams }: Props) {
  const bookingId = searchParams?.bookingId

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navigation />
        <main className="container mx-auto py-32 px-4 text-center">
          <h1 className="text-3xl font-black">Booking Success</h1>
          <p className="text-zinc-400 mt-4">No booking id provided.</p>
          <p className="mt-6">
            <Link href="/fleet" className="text-red-500 underline">Return to fleet</Link>
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  const supabase = createAdminClient()

  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, cars(*)')
      .eq('id', bookingId)
      .maybeSingle()

    if (error || !booking) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white">
          <Navigation />
          <main className="container mx-auto py-32 px-4 text-center">
            <h1 className="text-3xl font-black">Booking Created</h1>
            <p className="text-zinc-400 mt-4">We could not find full booking details for <span className="font-mono">{bookingId}</span>.</p>
            <p className="mt-6">If you need help, please contact support.</p>
            <p className="mt-6">
              <Link href="/fleet" className="text-red-500 underline">Return to fleet</Link>
            </p>
          </main>
          <Footer />
        </div>
      )
    }

    const car = booking.cars

    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navigation />
        <main className="container mx-auto py-24 px-4">
          <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <h1 className="text-3xl font-black">Booking Confirmed</h1>
            <p className="text-zinc-400 mt-3">Thank you — your booking is now recorded and visible in the admin panel.</p>

            <div className="mt-6 text-left space-y-3">
              <div><span className="text-zinc-500">Booking ID:</span> <span className="font-mono">{booking.id}</span></div>
              <div><span className="text-zinc-500">Reference:</span> {booking.reference_number || '—'}</div>
              <div><span className="text-zinc-500">Status:</span> {booking.status}</div>
              <div><span className="text-zinc-500">Payment Status:</span> {booking.payment_status}</div>
              {car && (
                <div>
                  <span className="text-zinc-500">Car:</span> {car.year} {car.make} {car.model}
                </div>
              )}
              <div><span className="text-zinc-500">Pickup:</span> {new Date(booking.pickup_datetime).toLocaleString()}</div>
              <div><span className="text-zinc-500">Dropoff:</span> {new Date(booking.dropoff_datetime).toLocaleString()}</div>
              <div><span className="text-zinc-500">Total:</span> ${Number(booking.total_amount || 0).toFixed(2)}</div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Link href="/fleet" className="px-6 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700">Back to Fleet</Link>
              <Link href={`/admin/bookings/${booking.id}`} className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700">View Booking (Admin)</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )

  } catch (err) {
    console.error('[Checkout Success] Error fetching booking:', err)
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navigation />
        <main className="container mx-auto py-32 px-4 text-center">
          <h1 className="text-3xl font-black">Booking Created</h1>
          <p className="text-zinc-400 mt-4">An error occurred while loading booking details.</p>
          <p className="mt-6">
            <Link href="/fleet" className="text-red-500 underline">Return to fleet</Link>
          </p>
        </main>
        <Footer />
      </div>
    )
}
}
