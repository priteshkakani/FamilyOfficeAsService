// Utility to format numbers as INR currency (₹1,23,456)
export default function formatINR(n) {
  const num = Number.isFinite(+n) ? +n : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

// Quick unit test (run only if NODE_ENV === 'test')
if (
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "test"
) {
  const assert = (input, expected) => {
    if (formatINR(input) !== expected)
      throw new Error(`formatINR(${input}) !== ${expected}`);
  };
  assert(undefined, "₹0");
  assert(null, "₹0");
  assert(0, "₹0");
  assert(123456, "₹1,23,456");
  assert("999", "₹999");
}
