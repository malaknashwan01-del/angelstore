export type FieldName = "fullName" | "email" | "phone" | "city" | "address";
export type Values = Record<FieldName, string>;
export type Errors = Partial<Record<FieldName, string>>;

// التحقق من الفورم — بيرجّع object فيه رسالة خطأ لكل حقل غلط
export function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.fullName.trim().length < 3) errors.fullName = "Please enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Please enter a valid email";
  if (!/^\+?[\d\s-]{8,15}$/.test(values.phone)) errors.phone = "Please enter a valid phone number";
  if (!values.city.trim()) errors.city = "City is required";
  if (values.address.trim().length < 5) errors.address = "Please enter your address";
  return errors;
}

