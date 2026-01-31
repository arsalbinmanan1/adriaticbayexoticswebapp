import { z } from 'zod'

export const checkoutSchema = z.object({
    // Step 1: Personal Details
    customerName: z.string().min(2, "Full name is required"),
    customerEmail: z.string().email("Invalid email address"),
    customerPhone: z.string().min(10, "Invalid phone number"),
    customerDob: z.string().refine((dob) => {
        const age = (new Date().getTime() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365)
        return age >= 21
    }, "You must be at least 21 years old"),

    // Address
    customerAddressStreet: z.string().min(5, "Street address is required"),
    customerAddressCity: z.string().min(2, "City is required"),
    customerAddressState: z.string().min(2, "State is required"),
    customerAddressZip: z.string().min(5, "Invalid ZIP code"),

    // License
    licenseNumber: z.string().min(5, "License number is required"),
    licenseState: z.string().min(2, "License state is required"),
    licenseExpiration: z.string().refine((val) => new Date(val) > new Date(), "License must be valid"),

    // Additional Driver
    hasAdditionalDriver: z.boolean().default(false),
    additionalDriverName: z.string().optional(),
    additionalDriverLicense: z.string().optional(),

    // Step 2: Rental Details
    pickupDatetime: z.string().refine((val) => new Date(val) > new Date(), "Pickup must be in the future"),
    dropoffDatetime: z.string(),
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
