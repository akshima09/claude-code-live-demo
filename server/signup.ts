export function validateSignupPassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 12) errors.push("Use at least 12 characters");
  if (!/[A-Z]/.test(password)) errors.push("Add an uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("Add a number");
  return errors;
}

