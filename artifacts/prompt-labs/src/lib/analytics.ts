import { analyticsPromise } from "./firebase";
import { logEvent } from "firebase/analytics";

export async function trackEvent(name: string, params?: Record<string, unknown>) {
  const analytics = await analyticsPromise;
  if (analytics) logEvent(analytics, name, params);
}
