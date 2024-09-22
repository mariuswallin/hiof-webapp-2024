import { formatDistance as fDistance } from "date-fns";
import { nb } from "date-fns/locale";

export function formatDistance(updatedAt: Date): string {
  return fDistance(updatedAt, new Date(), {
    addSuffix: true,
    includeSeconds: true,
    locale: nb,
  });
}
