export const formatPrice = (value: number) => `$${value.toFixed(2)}`;

// شحن مجاني فوق 50$
export const FREE_SHIPPING_FROM = 50;
export const SHIPPING_COST = 5;
export const getShipping = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
