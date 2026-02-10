import { z } from 'zod'
import { isValidPhoneNumber } from '@/lib/validation/phone'

export const checkoutSchema = z.object({
    // Step 1: Personal Details
    customerName: z.string().min(2, "Full name is required"),
    customerEmail: z.string().email("Invalid email address"),
    customerPhone: z.string().refine(isValidPhoneNumber, "Invalid phone number"),
    customerDob: z.string()
        .refine((dob) => !Number.isNaN(new Date(dob).getTime()), "Invalid date of birth")
        .refine((dob) => {
            const dobDate = new Date(dob)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return dobDate <= today
        }, "Date of birth cannot be in the future")
        .refine((dob) => {
            const dobDate = new Date(dob)
            const today = new Date()
            let age = today.getFullYear() - dobDate.getFullYear()
            const monthDelta = today.getMonth() - dobDate.getMonth()
            if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dobDate.getDate())) {
                age -= 1
            }
            return age >= 18
        }, "You must be at least 18 years old"),

    // Address
    customerAddressStreet: z.string().min(5, "Street address is required"),
    customerAddressCity: z.string().min(2, "City is required"),
    customerAddressState: z.string().min(2, "State is required"),
    customerAddressZip: z.string().min(5, "Invalid ZIP code"),

    // License
    //licenseNumber: z.string().min(5, "License number is required"),
    //licenseState: z.string().min(2, "License state is required"),
    //licenseExpiration: z.string().refine((val) => new Date(val) > new Date(), "License must be valid"),
 
    // Additional Driver
    hasAdditionalDriver: z.boolean().default(false),
    additionalDriverName: z.string().optional(),
    additionalDriverLicense: z.string().optional(),

    // Step 2: Rental Details
    pickupDatetime: z.string()
        .refine((val) => !Number.isNaN(new Date(val).getTime()), "Invalid pickup date")
        .refine((val) => new Date(val) > new Date(), "Pickup must be in the future"),
    dropoffDatetime: z.string()
        .refine((val) => !Number.isNaN(new Date(val).getTime()), "Invalid dropoff date"),
    pickupLocation: z.string().min(1, "Pickup location is required"),
    dropoffLocation: z.string().min(1, "Dropoff location is required"),

    // Step 3: Add-ons & Promo
    addOnSelection: z.array(z.string()).default([]),
    promoCode: z.string().optional(),
    agreeToTerms: z.boolean().refine(v => v === true, "You must agree to the terms"),
}).refine((data) => {

    return new Date(data.dropoffDatetime) > new Date(data.pickupDatetime)
}, {
    message: "Dropoff must be after pickup",
    path: ["dropoffDatetime"]
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
