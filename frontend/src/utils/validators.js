export function isValidPAN(pan) {
  if (!pan) return false;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
}

export function isValidIFSC(ifsc) {
  if (!ifsc) return false;
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
}

export function isValidUAN(uan) {
  if (!uan) return false;
  return /^[0-9]{12}$/.test(String(uan));
}

export function isNonNegativeNumber(v) {
  if (v === null || v === undefined || v === "") return false;
  const n = Number(v);
  return !Number.isNaN(n) && n >= 0;
}
