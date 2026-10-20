import { ConflictException } from '@nestjs/common';
import { dateOnly } from '../Src/Infrastructure/rules';
export interface Term {
  id: string;
  tenant_id: string;
  start_date: Date;
  end_date: Date;
  termination_date: Date | null;
}
export function effectiveEnd(term: Term) {
  return term.termination_date && term.termination_date < term.end_date
    ? term.termination_date
    : term.end_date;
}
export function current(term: Term, business_date: string) {
  return dateOnly(term.start_date) <= business_date && business_date < dateOnly(effectiveEnd(term));
}
export function assertCapacity(terms: Term[], capacity: number, business_date: string) {
  const events: { date: string; delta: number }[] = [];
  for (const term of terms) {
    const end = dateOnly(effectiveEnd(term));
    const start = dateOnly(term.start_date);
    if (end <= start || end <= business_date) continue;
    events.push(
      { date: start < business_date ? business_date : start, delta: 1 },
      { date: end, delta: -1 },
    );
  }
  events.sort((a, b) => a.date.localeCompare(b.date) || a.delta - b.delta);
  let used = 0;
  for (const event of events) {
    used += event.delta;
    if (used > capacity) throw new ConflictException('Contract terms exceed the resource capacity');
  }
}
export function occupancyStatus(
  term: Term,
  business_date: string,
): 'Current' | 'Upcoming' | 'Ended' {
  if (effectiveEnd(term) <= term.start_date) return 'Ended';
  if (current(term, business_date)) return 'Current';
  return business_date < dateOnly(term.start_date) ? 'Upcoming' : 'Ended';
}
export function addDays(date: string, days: number) {
  const value = new Date(date + 'T00:00:00Z');
  value.setUTCDate(value.getUTCDate() + days);
  return dateOnly(value);
}
export function upcoming(date: string, business_date: string, days = 7) {
  return business_date < date && date <= addDays(business_date, days);
}
export function classify(
  term: Term,
  business_date: string,
): 'Upcoming' | 'Active' | 'Expiring Soon' | 'Expired' | 'Terminated' {
  if (term.termination_date && dateOnly(term.termination_date) <= business_date)
    return 'Terminated';
  if (business_date < dateOnly(term.start_date)) return 'Upcoming';
  const end = dateOnly(effectiveEnd(term));
  if (business_date >= end) return 'Expired';
  if (upcoming(end, business_date, 30)) return 'Expiring Soon';
  return 'Active';
}
