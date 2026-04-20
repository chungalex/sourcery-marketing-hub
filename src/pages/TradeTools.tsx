import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { TariffCalculator } from "@/components/platform/TariffCalculator";
import { MarginCalculator } from "@/components/platform/MarginCalculator";
import { Globe, TrendingUp, Calculator, FileText, Search } from "lucide-react";

const HTS_CODES = [
  { code: "6109.10", desc: "T-shirts, knit, cotton", vn_us: 16.5, vn_uk: 12, vn_eu: 12 },
  { code: "6203.42", desc: "Denim jeans / trousers", vn_us: 16.6, vn_uk: 12, vn_eu: 12 },
  { code: "6201.93", desc: "Jackets, woven, man-made fibre", vn_us: 27.3, vn_uk: 12, vn_eu: 12 },
  { code: "6110.20", desc: "Sweaters / knitwear, cotton", vn_us: 17.5, vn_uk: 12, vn_eu: 12 },
  { code: "6211.43", desc: "Activewear / tracksuits", vn_us: 14.9, vn_uk: 12, vn_eu: 12 },
  { code: "6211.11", desc: "Swimwear, men's", vn_us: 27.8, vn_uk: 12, vn_eu: 12 },
  { code: "6211.12", desc: "Swimwear, women's", vn_us: 11.4, vn_uk: 12, vn_eu: 12 },
  { code: "6204.62", desc: "Women's trousers, cotton", vn_us: 16.6, vn_uk: 12, vn_eu: 12 },
  { code: "6205.20", desc: "Men's shirts, woven, cotton", vn_us: 19.7, vn_uk: 12, vn_eu: 12 },
  { code: "6206.30", desc: "Women's blouses, cotton", vn_us: 15.4, vn_uk: 12, vn_eu: 12 },
  { code: "6301.40", desc: "Blankets / throws, synthetic", vn_us: 9.3, vn_uk: 12, vn_eu: 12 },
  { code: "4202.22", desc: "Handbags, leather", vn_us: 9.0, vn_uk: 12, vn_eu: 3.7 },
  { code: "6403.99", desc: "Footwear, leather uppers", vn_us: 10.0, vn_uk: 12, vn_eu: 8.0 },
  { code: "9404.90", desc: "Cushions / pillows", vn_us: 9.0, vn_uk: 12, vn_eu: 0 },
  { code: "6302.60", desc: "Towels, terry cloth", vn_us: 9.9, vn_uk: 12, vn_eu: 12 },
];

const FTA_INFO = [
  { agreement: "CPTPP", countries: "UK, Canada, Australia, Japan, New Zealand, Mexico + others", vn_benefit: "0–5% on most apparel vs standard MFN rates", requirement: "Yarn-forward rule of origin — fabric must be made in a CPTPP country", active: true },
  { agreement: "EVFTA", countries: "European Union (27 countries)", vn_benefit: "Phased reduction to 0–12% over 10 years from 2020", requirement: "Two-stage transformation required for most garments", active: true },
  { agreement: "VKFTA", countries: "South Korea", vn_benefit: "0% on most textile and garment categories", requirement: "Standard rules of origin — substantial transformation in Vietnam", active: true },
  { agreement: "RCEP", countries: "ASEAN + China, Japan, Korea, Australia, New Zealand", vn_benefit: "Reduced rates within Asia-Pacific region for intra-ASEAN trade", requirement: "40% regional value content or change in tariff classification", active: true },
  { agreement: "US-Vietnam BTA", countries: "United States", vn_benefit: "None — standard MFN rates apply (12–27% for apparel)", requirement: "No FTA currently in force. Vietnam gets MFN rate only.", active: false },
];

export default function TradeTools() {
  const [htsSearch, setHtsSearch] = useState("");

  const filtered = HTS_CODES.filter(h =>
    htsSearch.length < 2 || h.desc.toLowerCase().includes(htsSearch.toLowerCase()) || h.code.includes(htsSearch)
  );

  return (
    <Layout>
      <SEO
        title="Trade Tools — HTS Codes, Duty Rates, Tariff Calculator | Sourcery"
        description="Free trade tools for apparel brands: HTS code lookup, import duty rates for Vietnam, tariff comparison calculator, and FTA guidance."
      />
      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Trade tools</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Duty rates, HTS codes & tariff calculators</h1>
          <p className="text-muted-foreground leading-relaxed">Everything you need to understand what your goods will actually cost to import. Free tools — no login required.</p>
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Calculators</h2>
          <TariffCalculator />
          <MarginCalculator />
        </div>
      </section>

      <section className="section-padding border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">HTS code duty rates — Vietnam origin</h2>
          <p className="text-sm text-muted-foreground mb-4">Rates shown are for Vietnam-manufactured goods. Verify with your customs broker before importing.</p>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={htsSearch}
              onChange={e => setHtsSearch(e.target.value)}
              placeholder="Search by product or HTS code..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-background text-foreground"
            />
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">HTS code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">→ US</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">→ UK</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">→ EU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(h => (
                  <tr key={h.code} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{h.code}</td>
                    <td className="px-4 py-3 text-foreground">{h.desc}</td>
                    <td className="px-4 py-3 text-center font-medium text-foreground">{h.vn_us}%</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{h.vn_uk}%</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{h.vn_eu}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Rates as of 2025. China faces additional 145% Section 301 tariff to the US on top of MFN rates.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">Free trade agreements — Vietnam</h2>
          <div className="space-y-3">
            {FTA_INFO.map(fta => (
              <div key={fta.agreement} className={`p-4 rounded-xl border ${fta.active ? "border-border bg-card" : "border-border bg-secondary/30"}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-sm font-semibold text-foreground">{fta.agreement}</span>
                    <span className="text-xs text-muted-foreground ml-2">{fta.countries}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${fta.active ? "bg-green-500/10 text-green-700 border-green-400/30" : "bg-secondary text-muted-foreground border-border"}`}>
                    {fta.active ? "In force" : "No FTA"}
                  </span>
                </div>
                <p className="text-xs text-primary font-medium mb-1">{fta.vn_benefit}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{fta.requirement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
