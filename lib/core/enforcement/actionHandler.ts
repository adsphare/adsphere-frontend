export function handleEnforcement(decision: any, context: any) {
  // TEMP SAFE LOGIC (you can improve later)

  if (!decision) return false;

  if (decision.blocked) return false;

  return true;
}