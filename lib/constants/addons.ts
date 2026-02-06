import { AddOn } from "@/lib/payments/calculateAmounts";

export const AVAILABLE_ADDONS: AddOn[] = [
    {
        id: 'insurance-standard',
        name: 'Adriatic Bay Exotics Insurance (for cars under $599/day)',
        price: 219.00,
        type: 'per_day'
    },
    {
        id: 'insurance-premium',
        name: 'Adriatic Bay Exotics Insurance (for cars over $999/day)',
        price: 349.00,
        type: 'per_day'
    },
    {
        id: 'delivery',
        name: 'Delivery (50 mile radius from St Petersburg)',
        price: 150.00,
        type: 'fixed'
    },
    {
        id: 'child-seat',
        name: 'Child Safety Seat (only available in SUV and sedans)',
        price: 49.00,
        type: 'fixed'
    },
    {
        id: 'prepaid-fuel',
        name: 'Paid for Gas',
        price: 89.00,
        type: 'fixed'
    },
    {
        id: 'additional-mileage',
        name: 'Additional Mileage (Call to Quote)',
        price: 0.00,
        type: 'fixed'
    }
];
