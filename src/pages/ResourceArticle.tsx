import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ProductionAssistant } from "@/components/va/ProductionAssistant";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

// Article content keyed by slug
const articles: Record<string, {
  title: string;
  category: string;
  readTime: string;
  tags: string[];
  intro: string;
  sections: { heading: string; body: string }[];
  takeaway: string;
  related: string[];
}> = {
  "what-is-aql": {
    title: "What is AQL and how do you choose the right standard?",
    category: "Production fundamentals",
    readTime: "5 min",
    tags: ["QC", "Basics"],
    intro: "AQL stands for Acceptable Quality Limit — the maximum percentage of defective units you're willing to accept in a shipment. It's the number at the center of every garment QC inspection, and most brands either don't know what they've agreed to or default to whatever the factory suggests.",
    sections: [
      {
        heading: "How AQL works",
        body: "AQL defines a sampling plan: from a batch of 500 units, inspect X units, and if more than Y are defective, fail the batch. The AQL number (1.0, 1.5, 2.5, 4.0) is the defect threshold percentage. AQL 2.5 means you accept up to 2.5% defective units in the population you're inspecting. For 500 units at AQL 2.5, you'd inspect 80 units and accept up to 5 defects.\n\nDefects are classified as Critical (safety hazard — always zero tolerance), Major (would cause rejection by end customer — the AQL threshold applies), and Minor (workmanship issues that don't affect function). Most AQL standards apply to major defects only.",
      },
      {
        heading: "Which AQL level should you use?",
        body: "AQL 2.5 is the industry standard for most garment production and the right starting point for most brands.\n\nUse AQL 1.5 when: you're producing premium or technical product where quality consistency is central to your brand promise, or when previous orders with this factory have shown recurring issues.\n\nUse AQL 4.0 when: you're producing basics or commodity product where price is the priority and minor variations are acceptable. Not recommended for branded product.\n\nNever use AQL 0.65 in a standard garment context — it requires inspecting almost the entire batch and drives up QC cost without proportional benefit unless you're producing medical or safety-critical products.",
      },
      {
        heading: "What Sourcery does",
        body: "When you create an order on Sourcery, the AQL selector explains what each level means before you commit — including how many units will be inspected and what defect count will trigger a failure. The QC gate on the final payment milestone is set to the AQL level you chose at order creation. You can't accidentally accept a failing inspection without explicitly overriding the gate.",
      },
    ],
    takeaway: "Default to AQL 2.5 for most garment production. Tighten to 1.5 for premium product or repeat-problem factories. Always distinguish between critical, major, and minor defects — and make sure your factory knows which defect types your AQL threshold applies to.",
    related: ["incoterms-explained", "milestone-payments", "sampling-rounds"],
  },
  "incoterms-explained": {
    title: "Incoterms explained — EXW, FOB, CIF, DDP",
    category: "Production fundamentals",
    readTime: "6 min",
    tags: ["Shipping", "Basics"],
    intro: "Incoterms (International Commercial Terms) define exactly where the seller's responsibility ends and the buyer's begins. There are 11 of them but you only need to know four — and you need to understand them before you sign a purchase order, not after your goods are stuck at customs.",
    sections: [
      {
        heading: "EXW — Ex Works",
        body: "The factory's responsibility ends at their door. You handle everything: pickup, export clearance, freight, insurance, import clearance, and last-mile delivery. Maximum control for the buyer — but maximum complexity. Only use EXW if you have a freight forwarder in the origin country who handles the pickup. Most small brands don't.",
      },
      {
        heading: "FOB — Free on Board",
        body: "The factory gets goods to the origin port and loaded onto the vessel. Your responsibility — and your risk — starts the moment goods are on the ship. You arrange and pay for ocean freight, insurance, import duties, customs clearance, and delivery to your warehouse. FOB is the standard for most brands sourcing from Asia. You get freight quotes yourself, giving you control and visibility over the full cost.",
      },
      {
        heading: "CIF — Cost, Insurance, Freight",
        body: "The factory arranges and pays for freight and insurance to your destination port. You handle import duties and local delivery. Sounds easier — but you lose control and visibility over the shipping process, and the factory's freight quote is often marked up. Use CIF only if you genuinely can't arrange freight yourself and you've verified the freight cost is reasonable.",
      },
      {
        heading: "DDP — Delivered Duty Paid",
        body: "The factory delivers to your door and pays everything, including duties. Sounds like the simplest option. It isn't. The factory is calculating and paying duties on your behalf — and they often get the HTS code wrong. You're legally liable for correct duty classification even if the factory made the error. DDP also means you have no visibility into what duties were actually paid. Avoid it unless you've verified the factory's customs process is reliable.",
      },
      {
        heading: "Which one to use",
        body: "For most brands sourcing from Vietnam or China: use FOB. It's the standard for a reason. You control the freight cost, you know exactly what you're paying for, and you avoid the factory's markup on shipping and insurance. The extra work of arranging a freight forwarder is worth it.",
      },
    ],
    takeaway: "Default to FOB for Asia sourcing. It gives you cost control and visibility. EXW requires a local freight forwarder. CIF loses you freight visibility. DDP creates customs liability you can't control.",
    related: ["landed-cost-calculation", "freight-documents", "milestone-payments"],
  },
  "garment-supply-chain-map": {
    title: "The garment supply chain — every node, every handoff risk",
    category: "Supply chain",
    readTime: "8 min",
    tags: ["Supply chain", "Overview"],
    intro: "Most brands manage production with two active relationships: the garment factory and the freight forwarder. Everything in between is invisible. That invisibility is where most production failures actually happen — not at the factory, but in the handoffs the brand never sees.",
    sections: [
      {
        heading: "The full chain",
        body: "Raw material (cotton, wool, synthetic fibre) → Yarn spinning → Fabric weaving or knitting → Dyeing and finishing → Cut and sew (the garment factory most brands work with) → QC inspection → Packing → Freight forwarder → Origin port → Ocean transit → Destination port → Customs clearance → Last-mile delivery → Your warehouse.\n\nMost brands are actively managing only two nodes: cut-and-sew and freight. Everything upstream of the garment factory and between the factory and your warehouse is handled by parties you've likely never spoken to.",
      },
      {
        heading: "The handoffs that go wrong",
        body: "Fabric mill → Factory: Factory receives wrong fabric weight, incorrect colour, or insufficient quantity. No record of what was actually delivered. You don't find out until finished goods arrive wrong.\n\nTrim supplier → Factory: Trims arrive late, holding up production. Or wrong trims arrive — wrong colour snap, wrong thread count, wrong label content. Production either stops or ships wrong.\n\nFactory → QC inspector: Goods presented for inspection before the brand is notified. Factory negotiates informally with inspector. Brand has no record of what was inspected or what was discussed.\n\nFactory → Freight forwarder: Packing list doesn't match actual goods. Shorts and overages not documented. You pay for 500 units; 487 ship and the packing list says 500.\n\nFreight forwarder → Customs: Wrong HTS code. Missing certificate. Duties calculated at wrong rate. Cargo held while you pay storage fees.",
      },
      {
        heading: "What you can control",
        body: "You can't control what happens at the yarn mill. You can control the handoffs that touch your order directly.\n\nBetween trim supplier and garment factory: require confirmed receipt from the factory before production begins. Sourcery's multi-supplier coordination feature makes this a formal platform gate — both parties confirm, both are on record.\n\nBetween factory and QC inspection: use a third-party QC agency you book directly, not one the factory recommends. Receive the report directly before releasing any payment.\n\nBetween factory and freight forwarder: require a packing list that matches your PO quantity before goods leave the factory. Check it against what arrives.\n\nBetween freight forwarder and customs: verify your HTS codes before shipment, not after. Have your freight documents ready before goods arrive at the port.",
      },
    ],
    takeaway: "The handoffs you don't manage are the ones that cost you. The trim-to-factory handoff, the QC step, and the packing list verification are the three you can control directly — and the three most brands leave to chance.",
    related: ["trim-coordination", "freight-documents", "lead-time-stacking"],
  },
  "vietnam-manufacturing-guide": {
    title: "Vietnam — the production guide for apparel brands",
    category: "Market guides",
    readTime: "9 min",
    tags: ["Vietnam", "Market"],
    intro: "Vietnam became the dominant destination for premium apparel production over the past decade — driven by skilled labour, strong denim and woven capabilities, improving certification coverage, and competitive costs relative to comparable quality in China. But 'source from Vietnam' is too broad to be useful. Here's what actually matters.",
    sections: [
      {
        heading: "What Vietnam is strong in",
        body: "Denim and woven outerwear — Vietnam's strongest category by volume and quality consistency. Ho Chi Minh City and the surrounding provinces have deep denim expertise from decades of producing for major global brands.\n\nSports and activewear — strong technical fabric handling, growing sustainable certification coverage (OEKO-TEX, bluesign), competitive on synthetic performance fabrics.\n\nCasual wovens — shirts, trousers, lightweight jackets. Well-established supply chains, reliable lead times.\n\nLuxury knitwear — improving but not the primary strength. For premium knitwear, consider Portugal or specialist Vietnamese factories with a verified track record.",
      },
      {
        heading: "Realistic MOQs and lead times",
        body: "MOQ: 300–500 units per style is realistic for established factories working with independent brands. Smaller factories (boutique manufacturers) will work at 100–200 units but with longer lead times and less infrastructure. Above 1,000 units per style opens access to the largest facilities.\n\nLead time: 12–16 weeks from approved tech pack to goods at port is realistic for wovens. Add 3–4 weeks for sampling before that. Denim specifically: 14–18 weeks given the washing and finishing stages. Brands who plan for 10 weeks consistently miss their delivery windows.",
      },
      {
        heading: "What to ask every Vietnam factory",
        body: "Which brands have you produced for in the last 12 months? (Ask for references, not just names.) What certifications do you hold and when do they expire? What is your QC process — do you have an in-house QC team? What happens when there's a defect in bulk — what's your process? What is your capacity and how many brands are you currently working with?\n\nRed flags: factory unwilling to share references; certificate copies that look digitally altered; pressure to skip sample rounds; no in-house QC team on a facility of significant scale.",
      },
      {
        heading: "Ho Chi Minh City vs Hanoi vs provinces",
        body: "Ho Chi Minh City (and surrounding provinces — Binh Duong, Dong Nai, Long An): the hub for denim, wovens, and outerwear. Largest concentration of factories working with international brands. Better English communication on average. Higher base costs.\n\nHanoi: stronger on embroidery, traditional techniques, and some casualwear. Less infrastructure for technical or performance product.\n\nProvincial factories: lower cost, often lower MOQ, but logistics are more complex and English communication is harder. Requires a local agent or production manager unless you're experienced.",
      },
    ],
    takeaway: "Vietnam is the right call for denim, wovens, and casual outerwear at 300+ units per style. Plan 16 weeks minimum from approved tech pack to delivered goods. Verify certifications directly — don't rely on factory claims.",
    related: ["vietnam-vs-china", "factory-auditing", "evaluating-factory-before-wiring"],
  },
  "landed-cost-calculation": {
    title: "How to calculate your real landed cost",
    category: "Imports & exports",
    readTime: "6 min",
    tags: ["Landed cost", "Duties"],
    intro: "FOB price is not your cost. It's the cost of goods at the origin port before they've moved an inch toward your market. Your real cost — the number that determines your margin — is your landed cost. Most brands find out what this is after their first shipment. Here's how to calculate it before.",
    sections: [
      {
        heading: "The formula",
        body: "Landed cost = FOB price + Ocean freight + Insurance + Import duties + Customs brokerage fee + Port handling and drayage.\n\nExample: 500 denim jackets, Vietnam to Los Angeles.\n- FOB price: 500 × $28 = $14,000\n- Ocean freight (LCL): $1,000\n- Insurance (0.75% of cargo value): $105\n- US import duty (denim jackets, HTS 6201.92, 27.9% on FOB): $3,906\n- Customs brokerage: $250\n- Port handling and drayage: $350\n- Total landed: $19,611\n- Per unit landed cost: $39.22\n\nYou thought your cost was $28. Your real cost is $39.22. That's a 40% difference.",
      },
      {
        heading: "The duty trap",
        body: "US import duties on apparel are high and vary significantly by category. Denim jackets: 27.9%. Cotton knit sweaters: 16.5%. Synthetic woven trousers: 28.6%. The rate is determined by your HTS code — a classification system based on fibre content, construction method, and garment type.\n\nA woven jacket and a knit jacket have different HTS codes and different duty rates. Getting this wrong doesn't just mean paying the wrong amount — you're legally liable for correct classification. The freight forwarder classifies on your behalf, but you're responsible for the outcome.",
      },
      {
        heading: "What changes your landed cost",
        body: "Order volume: ocean freight is largely fixed cost per container or LCL shipment. At higher volumes, freight per unit drops significantly.\n\nIncoterms: under CIF, the factory includes freight in their quote — usually at a markup. Under FOB, you arrange freight directly and see the real cost.\n\nFreight mode: air freight is 4–6× more expensive than ocean. A single air shipment to cover a late order can eliminate the margin on that entire production run.\n\nCurrency: if you're paying in VND or RMB rather than USD, currency movement between order date and payment date changes your effective cost. A 3% VND move on $20,000 is $600.",
      },
    ],
    takeaway: "Calculate landed cost before you price your product, not after. The duty rate on your specific HTS code is the biggest variable most brands miss — and at 27.9% on denim, it's the difference between a healthy margin and a difficult conversation.",
    related: ["hts-codes-apparel", "incoterms-explained", "fx-risk-production"],
  },
  "gots-bsci-oeko-tex": {
    title: "GOTS, BSCI, OEKO-TEX, WRAP — what each certification actually means",
    category: "Traceability & compliance",
    readTime: "7 min",
    tags: ["Compliance", "Certifications"],
    intro: "Certifications are requested by wholesale accounts, required by some markets, and used by brands as proof of their supply chain claims. Most brands know the names but not what they actually certify — or how to verify them. Here's what each one means, who needs it, and how to check it's real.",
    sections: [
      {
        heading: "GOTS — Global Organic Textile Standard",
        body: "What it certifies: the organic status of textiles from raw fibre through to the finished product, including processing and manufacturing. Covers both ecological and social criteria.\n\nWho needs it: brands making sustainability claims based on organic inputs. Required if you're labelling a product as organic or GOTS-certified. Increasingly required by European retailers.\n\nWho holds it: both the factory and the fabric supplier must be certified — GOTS is a chain-of-custody certification. A GOTS-certified factory using uncertified organic fabric cannot produce a GOTS product.\n\nHow to verify: the GOTS public database lists every certified facility. Verify certificate number and expiry date directly on the GOTS website — don't rely on factory-provided copies.",
      },
      {
        heading: "BSCI — Business Social Compliance Initiative",
        body: "What it certifies: social compliance — working conditions, labour rights, health and safety, living wages. A factory audit standard, not a product standard.\n\nWho needs it: brands selling to major European retailers (H&M, Zara, Marks & Spencer) who require BSCI compliance from their suppliers. Less commonly required in the US market.\n\nHow it works: the factory undergoes an audit by an accredited auditor. Results are graded A (outstanding) to E (business relationship not recommended). A and B are passing grades.\n\nHow to verify: BSCI results are shared through the amfori platform. Request the audit report directly from the factory — the grade and expiry date should be visible.",
      },
      {
        heading: "OEKO-TEX Standard 100",
        body: "What it certifies: that every component of a textile product has been tested for harmful substances. This is a product certification — it certifies the finished article, not the factory's processes.\n\nWho needs it: brands selling product for babies or direct skin contact, or anyone making 'tested for harmful substances' claims. Increasingly requested by premium retail accounts.\n\nImportant distinction: OEKO-TEX Standard 100 tests the product. OEKO-TEX STeP tests the factory's production processes. They're different certifications for different purposes.\n\nHow to verify: OEKO-TEX has a public database. Enter the certificate number to confirm validity and scope.",
      },
      {
        heading: "WRAP — Worldwide Responsible Accredited Production",
        body: "What it certifies: ethical manufacturing practices — labour law compliance, working conditions, environmental responsibility. Common in the US market.\n\nHow it works: factory self-assessment followed by independent audit. Three certification levels: Platinum, Gold, Silver.\n\nHow to verify: WRAP maintains a public database of certified facilities.",
      },
    ],
    takeaway: "Every certification has a public database — verify certificate numbers and expiry dates directly, not from factory-provided copies. GOTS is chain-of-custody (factory and supplier both need it). BSCI and WRAP are factory audits. OEKO-TEX 100 is a product test. Know which one your retail accounts actually require before sourcing.",
    related: ["factory-auditing", "supply-chain-traceability", "evaluating-factory-before-wiring"],
  },
  "evaluating-factory-before-wiring": {
    title: "How to evaluate a factory before wiring a deposit",
    category: "Supplier trust",
    readTime: "7 min",
    tags: ["Due diligence", "Basics"],
    intro: "The deposit wire is the highest-risk moment in every production order. You're committing capital to someone you may have met once — or never — based on a sample and a sales conversation. Here's how to close the information gap before you send anything.",
    sections: [
      {
        heading: "What to request before you negotiate",
        body: "Business registration certificate — verifies the factory is a legal entity. Ask for it before the first serious conversation.\n\nCurrent certification copies — GOTS, BSCI, OEKO-TEX, WRAP, ISO. Request the actual certificates, not just the logos on their website. Verify them in the relevant database.\n\nRecent order references — two or three brands they've produced for in the past 12 months who you can contact. If they won't provide references, stop.\n\nFactory profile — production capacity, number of workers, main product categories, minimum order quantities, lead times. Should be provided without negotiation.",
      },
      {
        heading: "What to look for in a sample",
        body: "Stitching consistency across the whole garment — not just the visible parts. Check interior seams, waistbands, pocket bags.\n\nMeasurements against your spec — all of them, not a selection. A factory that returns a sample with measurements close to spec but not exact is showing you their process, not an anomaly.\n\nMaterial match — the fabric in the sample should match what's in your tech pack. Ask for a fabric test report if organic or certified materials are specified.\n\nConstruction details — are the details you specified actually there? Bartacks at stress points, topstitching weight, hardware quality. What's missing from a sample often reflects what the factory deprioritises in bulk.",
      },
      {
        heading: "Questions to ask directly",
        body: "Which brands are you currently producing for? Can I speak to their production contact?\n\nWhat is your current production capacity and how full are you?\n\nWhat happens when there's a defect in bulk — what's your process for resolution?\n\nDo you have an in-house QC team, and at what stages do they inspect?\n\nHave you ever had a dispute with a brand, and how was it resolved?\n\nThe answers matter less than how the factory responds to the questions. Defensive, evasive, or dismissive answers to legitimate questions are signals.",
      },
      {
        heading: "Red flags",
        body: "Pressure to skip sample rounds or move directly to bulk before approval.\n\nCertificate copies that show inconsistent formatting, blurry logos, or expiry dates in the past.\n\nUnwillingness to provide brand references or a factory visit.\n\nVague answers about capacity — 'we can handle anything' from a factory of uncertain scale.\n\nPrice that is significantly below market for the category — this is almost always a sign of compromise somewhere in the process.",
      },
    ],
    takeaway: "Verify every certification in the public database — not from factory copies. Ask for brand references and actually call them. Treat the sample as a process evaluation, not just a quality check. The factory that delivers a complete, correct sample quickly is showing you the same process they'll use in bulk.",
    related: ["factory-auditing", "milestone-payments", "reading-factory-quote"],
  },
};

const relatedTitles: Record<string, string> = {
  "what-is-aql": "What is AQL and how do you choose the right standard?",
  "incoterms-explained": "Incoterms explained — EXW, FOB, CIF, DDP",
  "milestone-payments": "How milestone payments protect you — and when they don't",
  "sampling-rounds": "How many sampling rounds is normal?",
  "landed-cost-calculation": "How to calculate your real landed cost",
  "freight-documents": "Freight documents — what you need and when",
  "fx-risk-production": "FX risk in production — why a 3% currency move matters",
  "hts-codes-apparel": "HTS codes for apparel — why getting them wrong costs money",
  "garment-supply-chain-map": "The garment supply chain — every node, every handoff risk",
  "trim-coordination": "Coordinating trim suppliers with garment factories",
  "lead-time-stacking": "Lead time stacking — why brands underestimate production by 6 weeks",
  "factory-auditing": "How to audit a factory before you commit",
  "supply-chain-traceability": "Supply chain traceability — why it matters more than ever",
  "evaluating-factory-before-wiring": "How to evaluate a factory before wiring a deposit",
  "vietnam-manufacturing-guide": "Vietnam — the production guide for apparel brands",
  "vietnam-vs-china": "Vietnam vs China — which is right for your brand?",
  "reading-factory-quote": "How to read a factory quote — and what to push back on",
};

export default function ResourceArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articles[slug] : null;

  if (!article) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-tight text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Article coming soon</h1>
            <p className="text-muted-foreground mb-6">This guide is being written. Check back shortly or browse the full resource library.</p>
            <Link to="/resources"><Button>Back to resources</Button></Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${article.title} — Sourcery Resources`}
        description={article.intro.slice(0, 155)}
      />

      <section className="section-padding">
        <div className="container-tight">

          {/* Back */}
          <Link to="/resources" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            All resources
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Meta */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">{article.category}</span>
              <span className="text-muted-foreground">·</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {article.readTime} read
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight max-w-2xl">
              {article.title}
            </h1>

            {/* Tags */}
            <div className="flex gap-2 mb-8">
              {article.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border">{tag}</span>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Article body */}
              <div className="lg:col-span-2">
                {/* Intro */}
                <p className="text-lg text-foreground leading-relaxed mb-8 font-medium">
                  {article.intro}
                </p>

                {/* Sections */}
                <div className="space-y-8">
                  {article.sections.map((section, i) => (
                    <div key={i}>
                      <h2 className="font-heading text-xl font-bold text-foreground mb-3">{section.heading}</h2>
                      <div className="space-y-3">
                        {section.body.split("\n\n").map((para, j) => (
                          <p key={j} className="text-muted-foreground leading-relaxed">{para}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Takeaway */}
                <div className="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">The takeaway</p>
                  <p className="text-foreground leading-relaxed">{article.takeaway}</p>
                </div>

                {/* Related */}
                {article.related.length > 0 && (
                  <div className="mt-10">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Related guides</p>
                    <div className="space-y-2">
                      {article.related.map((slug, i) => (
                        <Link key={i} to={`/resources/${slug}`} className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/30 bg-card hover:-translate-y-0.5 transition-all group">
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors flex-1">{relatedTitles[slug] || slug}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar — VA */}
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-xs font-semibold text-foreground mb-1">Have a question about this?</p>
                  <p className="text-xs text-muted-foreground mb-3">Ask the production assistant — it answers specifically, not generically.</p>
                  <ProductionAssistant mode="demo" className="w-full" />
                </div>

                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-sm font-semibold text-foreground mb-2">Put this into practice</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">Sourcery enforces the structure this guide describes — AQL gates, milestone payments, revision rounds. Your first order is free.</p>
                  <Link to="/auth?mode=signup">
                    <Button size="sm" className="w-full gap-1.5 text-xs">Start free <ArrowRight className="h-3 w-3" /></Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
