export function getPriceInfo(product: any, currencyCode: string = "USD") {
  const variant = product.variants?.[0];
  let currentPrice = 0;
  let originalPrice = 0;

  if (variant?.calculated_price) {
    currentPrice = variant.calculated_price.calculated_amount;
    originalPrice = variant.calculated_price.original_amount;
  } else if (variant?.prices?.[0]) {
    currentPrice = variant.prices[0].amount;
    originalPrice = variant.original_price || currentPrice;
  }

  // MedusaJS returns prices in the smallest currency unit (e.g., cents for USD)
  const zeroDecimalCurrencies = ["JPY", "KRW", "VND", "CLP", "PYG"];
  const divisor = zeroDecimalCurrencies.includes(currencyCode.toUpperCase()) ? 1 : 100;
  
  currentPrice = currentPrice / divisor;
  originalPrice = originalPrice / divisor;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  });

  return {
    currentPrice: formatter.format(currentPrice),
    originalPrice: formatter.format(originalPrice),
    hasDiscount: originalPrice > currentPrice
  };
}
