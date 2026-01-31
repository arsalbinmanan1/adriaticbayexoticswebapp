/**
 * Payment Calculation Utility
 * Centralizes all breakdown calculations for car rentals.
 * 
 * Rules:
 * - Security Deposit: $300 OR 20% of total rental, whichever is higher.
 * - Tax: 7% (Adjustable as per business requirements).
 */

export interface AddOn {
    id: string
    name: string
    price: number
    type: 'per_day' | 'fixed'
}

interface CalculationInput {
    dailyRate: number
    numberOfDays: number
    discountValue?: number
    discountType?: 'percentage' | 'fixed'
    addOns?: AddOn[]
    deliveryFee?: number
}

interface CalculationOutput {
    rentalSubtotal: number
    addOnsTotal: number
    discountApplied: number
    taxAmount: number
    deliveryFee: number
    totalRentalAmount: number
    securityDepositAmount: number
    remainingBalance: number
}

const TAX_RATE = 0.07 // 7%
const MIN_SECURITY_DEPOSIT = 300 // $300

export const calculateAmounts = (input: CalculationInput): CalculationOutput => {
    const { dailyRate, numberOfDays, discountValue = 0, discountType, addOns = [], deliveryFee = 0 } = input

    // 1. Rental Subtotal (Base Rate)
    const rentalSubtotal = dailyRate * numberOfDays

    // 2. Add-ons Calculation
    const addOnsTotal = addOns.reduce((acc, addOn) => {
        if (addOn.type === 'per_day') {
            return acc + (addOn.price * numberOfDays)
        }
        return acc + addOn.price
    }, 0)

    // 3. Discount Calculation (Applies to base rental only or total?) 
    // Usually applies to base rental.
    let discountApplied = 0
    if (discountType === 'percentage') {
        discountApplied = (rentalSubtotal * discountValue) / 100
    } else if (discountType === 'fixed') {
        discountApplied = discountValue
    }

    const netBaseRental = Math.max(0, rentalSubtotal - discountApplied)

    // 4. Taxes (Applies to net base + add-ons + delivery)
    const taxableAmount = netBaseRental + addOnsTotal + deliveryFee
    const taxAmount = Number((taxableAmount * TAX_RATE).toFixed(2))

    // 5. Total Rental Amount
    const totalRentalAmount = Number((taxableAmount + taxAmount).toFixed(2))

    // 6. Security Deposit Logic: MAX($300, 20% of Total)
    const calculatedDeposit = totalRentalAmount * 0.20
    const securityDepositAmount = Number(Math.max(MIN_SECURITY_DEPOSIT, calculatedDeposit).toFixed(2))

    // 7. Remaining Balance (Total - Deposit)
    // The balance is the full amount if deposit is just a hold, but here we keep it simple
    const remainingBalance = totalRentalAmount

    return {
        rentalSubtotal,
        addOnsTotal,
        discountApplied,
        taxAmount,
        deliveryFee,
        totalRentalAmount,
        securityDepositAmount,
        remainingBalance,
    }
}

