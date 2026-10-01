// Public destinations only. Never place client passwords or private gallery links here.
function publicDestination(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}
export const clientServices = {
  store: publicDestination(process.env.PRINT_STORE_URL),
  galleries: publicDestination(process.env.CLIENT_DELIVERY_URL),
};
