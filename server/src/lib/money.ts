export const FREE_SHIPPING_FROM_CENTS = 5000;
export const SHIPPING_CENTS = 500;

export const shippingFor = (subtotalCents: number) =>
  subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_FROM_CENTS ? 0 : SHIPPING_CENTS;

export const toDollars = (cents: number) => cents / 100;
export const toCents = (dollars: number) => Math.round(dollars * 100);
