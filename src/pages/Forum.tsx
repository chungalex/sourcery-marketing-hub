import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Users, Truck, TrendingUp, Pin, ArrowUp } from "lucide-react";

const spaces = [
  {
    id: "founders",
    icon: Users,
    label: "Founder forum",
    desc: "Brands talking to brands. Factory recommendations, production problems, market questions.",
    color: "text-primary bg-primary/10 border-primary/20",
    threads: [
      { title: "Best denim factories in Vietnam under 500 MOQ?", replies: 12, votes: 34, tag: "Factory rec", pinned: false, time: "2d ago" },
      { title: "How do you handle spec changes mid-production?", replies: 8, votes: 21, tag: "Operations", pinned: false, time: "3d ago" },
      { title: "First time importing from Vietnam — what surprised you?", replies: 19, votes: 47, tag: "Getting started", pinned: true, time: "1w ago" },
      { title: "Anyone using third-party QC agencies? Recommendations?", replies: 6, votes: 18, tag: "QC", pinned: false, time: "4d ago" },
      { title: "How to negotiate payment terms with a new factory", replies: 11, votes: 29, tag: "Negotiation", pinned: false, time: "5d ago" },
    ],
  },
  {
    id: "factories",
    icon: Truck,
    label: "Factory channel",
    desc: "Factories announcing capacity, capabilities, and connecting with brands directly.",
    color: "text-amber-700 bg-amber-500/10 border-amber-400/30",
    threads: [
      { title: "HU LA Studios — denim and woven outerwear, HCMC", replies: 4, votes: 22, tag: "Capacity", pinned: true, time: "1d ago" },
      { title: "Looking for premium knitwear brands — 200 MOQ", replies: 7, votes: 15, tag: "Looking for brands", pinned: false, time: "3d ago" },
      { title: "We handle rush orders — current capacity this month", replies: 2, votes: 9, tag: "Rush", pinned: false, time: "5d ago" },
    ],
  },
  {
    id: "supply-chain",
    icon: TrendingUp,
    label: "Supply chain",
    desc: "Open discussion on tariffs, freight, logistics, market moves, and trade policy.",
    color: "text-blue-700 bg-blue-500/10 border-blue-400/30",
    threads: [
      { title: "How is everyone handling the freight rate volatility?", replies: 16, votes: 41, tag: "Freight", pinned: false, time: "1d ago" },
      { title: "Vietnam tariff situation — what are you planning for?", replies: 23, votes: 67, tag: "Tariffs", pinned: true, time: "3d ago" },
      { title: "Alternative to China for trim sourcing?", replies: 9, votes: 28, tag: "Sourcing", pinned: false, time: "2d ago" },
      { title: "Red Sea situation still affecting your timelines?", replies: 14, votes: 35, tag: "Logistics", pinned: false, time: "1w ago" },
    ],
  },
];

export default function Forum() {
  const [activeSpace, setActiveSpace] = useState("founders");
  const active = spaces.find(s => s.id === activeSpace)!;

  return (
    <Layout>
      <SEO
        title="Community forum — Sourcery"
        description="Brands and factories talking to each other. Factory recommendations, production questions, supply chain discussions, tariff updates."
      />

      {/* Hero */}
      <section className="section-padding bg-[var(--hero-gradient)] border-b border-border">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">Community</p>
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                  Brands and factories.<br />Talking to each other.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The production community doesn't have a neutral space. Sourcery's forum is three channels: founders talking to founders, factories announcing capacity, and open supply chain discussion on tariffs, freight, and market moves.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {spaces.map(s => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSpace(s.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${activeSpace === s.id ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:border-primary/20"}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border mb-3 ${s.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-xs font-semibold text-foreground mb-1">{s.label}</p>
                      <p className="text-xs text-muted-foreground leading-snug">{s.desc.split(".")[0]}.</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active space */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Thread list */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading font-bold text-foreground">{active.label}</h2>
                  <p className="text-sm text-muted-foreground">{active.desc}</p>
                </div>
                <Link to="/auth?mode=signup">
                  <Button size="sm" className="gap-1.5 text-xs">Post a thread <ArrowRight className="h-3 w-3" /></Button>
                </Link>
              </div>

              <div className="space-y-2">
                {active.threads.map((thread, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors cursor-pointer group"
                  >
                    {/* Vote */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-semibold text-foreground">{thread.votes}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {thread.pinned && (
                          <div className="flex items-center gap-1">
                            <Pin className="h-3 w-3 text-primary" />
                            <span className="text-xs text-primary font-medium">Pinned</span>
                          </div>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${active.color}`}>
                          {thread.tag}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                        {thread.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {thread.replies} replies
                        </div>
                        <span>{thread.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Login to participate */}
              <div className="mt-6 p-5 rounded-xl bg-card/50 border border-border text-center">
                <p className="text-sm font-medium text-foreground mb-1">Join the conversation</p>
                <p className="text-xs text-muted-foreground mb-4">Sign up to post threads, reply, and vote. Free — no subscription required to participate.</p>
                <Link to="/auth?mode=signup">
                  <Button size="sm" className="gap-1.5 text-xs">Create an account <ArrowRight className="h-3 w-3" /></Button>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* All spaces */}
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">All spaces</p>
                <div className="space-y-1.5">
                  {spaces.map(s => {
                    const Icon = s.icon;
                    const count = s.threads.length;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveSpace(s.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${activeSpace === s.id ? "bg-primary/10" : "hover:bg-secondary"}`}
                      >
                        <Icon className={`h-4 w-4 flex-shrink-0 ${activeSpace === s.id ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium ${activeSpace === s.id ? "text-primary" : "text-foreground"}`}>{s.label}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Community guidelines */}
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Community guidelines</p>
                <div className="space-y-2">
                  {[
                    "Be specific — vague questions get vague answers",
                    "No soliciting or unsolicited outreach",
                    "Factory posts in the factory channel only",
                    "Sourcing recommendations based on experience only",
                    "Respect confidentiality — don't name factories negatively without direct experience",
                  ].map((rule, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs text-primary mt-0.5 flex-shrink-0">—</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources link */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <p className="text-xs font-semibold text-primary mb-2">Production resources</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">Before you post — check if the answer is already in the resource library.</p>
                <Link to="/resources">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs w-full">Browse resources <ArrowRight className="h-3 w-3" /></Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
