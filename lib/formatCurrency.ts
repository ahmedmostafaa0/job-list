export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'currency',
        maximumFractionDigits: 0
    }).format(amount)
}
