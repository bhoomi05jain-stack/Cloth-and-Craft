import { randomUUID } from 'crypto';

export function id(prefix?: string): string {
  const raw = randomUUID();
  return prefix ? `${prefix}-${raw}` : raw;
}
