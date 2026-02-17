// Square integration disabled — payments are temporarily turned off.
// The original Square client code has been commented out and replaced
// with lightweight stubs so other modules can still import the symbols
// without attempting to call the live Square API.

export const squareClient = {
    payments: {
        create: async () => { throw new Error('Payments are disabled') },
        get: async () => { throw new Error('Payments are disabled') }
    },
    checkout: {
        paymentLinks: {
            create: async () => { throw new Error('Payments are disabled') },
            get: async () => { throw new Error('Payments are disabled') }
        }
    },
    orders: {
        get: async () => { throw new Error('Payments are disabled') }
    },
    refunds: {
        refundPayment: async () => { throw new Error('Payments are disabled') }
    }
}

export const parseSquareError = (_error: unknown): string => {
    return 'Payments are currently disabled.'
}
