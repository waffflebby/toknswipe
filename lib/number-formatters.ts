const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "$0"
  }
  return currencyFormatter.format(value)
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%"
  }
  return percentFormatter.format(value)
}
