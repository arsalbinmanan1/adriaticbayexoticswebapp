import { inngest } from './client'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Scheduled function to cleanup expired bookings
 * Runs every 5 minutes
 */
export const cleanupExpiredBookings = inngest.createFunction(
    { id: 'cleanup-expired-bookings', name: 'Cleanup Expired Bookings' },
    { cron: '*/5 * * * *' }, // Every 5 minutes
    async ({ step }) => {
        const supabase = createAdminClient()

        const result = await step.run('cleanup-bookings', async () => {
            const { data: cleanedCount, error } = await supabase.rpc('cleanup_expired_bookings')

            if (error) {
                console.error('[CRON] Cleanup failed:', error)
                throw error
            }

            return { cleanedCount: cleanedCount || 0 }
        })

        // Alert if significant number of bookings were cleaned
        if (result.cleanedCount > 10) {
            await step.run('alert-high-cleanup', async () => {
                await inngest.send({
                    name: 'notification/high.cleanup.rate',
                    data: {
                        count: result.cleanedCount,
                        timestamp: new Date().toISOString()
                    }
                })
            })
        }

        return result
    }
)
