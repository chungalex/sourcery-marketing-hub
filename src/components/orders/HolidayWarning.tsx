import { useMemo } from "react";
import { format, isWithinInterval, addDays, parseISO } from "date-fns";
import { AlertTriangle } from "lucide-react";

interface HolidayWarningProps {
  factoryCountry: string | null;
  deliveryWindowStart?: string | null;
  deliveryWindowEnd?: string | null;
}

const HOLIDAYS: Record<string, { name: string; start: string; end: string; note: string }[]> = {
  VN: [
    { name: "Tết Nguyên Đán (Lunar New Year)", start: "2026-02-17", end: "2026-02-24", note: "Factories typically close 2–4 weeks. Book production slot before Dec 15 or plan for March delivery." },
    { name: "Giỗ Tổ Hùng Vương", start: "2026-04-06", end: "2026-04-07", note: "1–2 day closure. Minor impact." },
    { name: "Liberation Day / Labour Day", start: "2026-04-30", end: "2026-05-03", note: "3–4 day closure. Minor impact on weekly production." },
    { name: "National Day", start: "2025-09-02", end: "2025-09-03", note: "1–2 day closure." },
    { name: "Tết Nguyên Đán (Lunar New Year)", start: "2025-01-28", end: "2025-02-04", note: "Factories typically close 2–4 weeks." },
  ],
  CN: [
    { name: "Chinese New Year (Golden Week)", start: "2026-01-28", end: "2026-02-11", note: "Full factory closure 2–3 weeks. Plan around it." },
    { name: "Golden Week (National Day)", start: "2025-10-01", end: "2025-10-07", note: "Full factory closure 1 week." },
    { name: "Chinese New Year", start: "2025-01-29", end: "2025-02-12", note: "Full factory closure 2–3 weeks." },
  ],
  BD: [
    { name: "Eid ul-Fitr", start: "2025-03-30", end: "2025-04-03", note: "Major holiday. 3–5 day closure typical." },
  ],
  IN: [
    { name: "Diwali", start: "2025-10-20", end: "2025-10-25", note: "Regional variation. North India factories often close." },
  ],
};

export function HolidayWarning({ factoryCountry, deliveryWindowStart, deliveryWindowEnd }: HolidayWarningProps) {
  const warnings = useMemo(() => {
    if (!factoryCountry || !deliveryWindowStart) return [];
    const country = factoryCountry.toUpperCase().slice(0, 2);
    const holidays = HOLIDAYS[country] || [];
    if (!holidays.length) return [];

    const windowStart = parseISO(deliveryWindowStart);
    const windowEnd = deliveryWindowEnd ? parseISO(deliveryWindowEnd) : addDays(windowStart, 90);

    return holidays.filter(h => {
      const hStart = parseISO(h.start);
      const hEnd = parseISO(h.end);
      return isWithinInterval(hStart, { start: windowStart, end: windowEnd }) ||
             isWithinInterval(hEnd, { start: windowStart, end: windowEnd }) ||
             (hStart <= windowStart && hEnd >= windowEnd);
    });
  }, [factoryCountry, deliveryWindowStart, deliveryWindowEnd]);

  if (!warnings.length) return null;

  return (
    <div className="space-y-2">
      {warnings.map((w, i) => (
        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-400/30">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-700">{w.name} — {format(new Date(w.start), "MMM d")}–{format(new Date(w.end), "MMM d")}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{w.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
