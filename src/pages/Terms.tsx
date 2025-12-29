import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing and using Sourcery's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.`,
  },
  {
    title: "Description of Services",
    content: `Sourcery provides a platform connecting brands with vetted manufacturing partners. Our services include:

• Factory matching and vetting
• Quality control and inspection services
• Production tracking and management
• Sourcing consultation and support
• Sample management and coordination`,
  },
  {
    title: "User Accounts",
    content: `To access certain features of our services, you may be required to create an account. You agree to:

• Provide accurate and complete information
• Maintain the security of your account credentials
• Promptly update any changes to your information
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized access`,
  },
  {
    title: "Brand Responsibilities",
    content: `As a brand using our platform, you agree to:

• Provide accurate product specifications and requirements
• Respond to communications in a timely manner
• Make payments according to agreed terms
• Respect intellectual property rights
• Comply with all applicable laws and regulations`,
  },
  {
    title: "Factory Partner Responsibilities",
    content: `As a factory partner on our platform, you agree to:

• Maintain accurate capability and capacity information
• Deliver products meeting agreed specifications
• Adhere to quality standards and timelines
• Comply with labor and safety regulations
• Allow scheduled inspections and audits`,
  },
  {
    title: "Payment Terms",
    content: `Payment terms are established on a per-project basis. Generally:

• Deposits are required before production begins
• Milestone payments may be required for larger orders
• Final payment is due upon completion and inspection
• All fees are non-refundable unless otherwise specified
• Late payments may incur additional charges`,
  },
  {
    title: "Intellectual Property",
    content: `All content, trademarks, and intellectual property on our platform remain the property of Sourcery or respective owners. Users retain ownership of their product designs and specifications shared through our platform.`,
  },
  {
    title: "Client Due Diligence & Responsibility",
    content: `While Sourcery works diligently to vet and curate our factory network, all manufacturing partnerships formed through our platform are ultimately the client's responsibility. By using our services, you acknowledge and agree that:

• You are responsible for conducting your own due diligence before entering into any manufacturing agreement
• Factory profiles, certifications, and capabilities should be independently verified before committing to production
• Sample orders and trial runs are strongly recommended before placing large orders
• Any tools, calculators, or estimates provided on our platform are for informational purposes only and should be fact-checked
• Sourcery does not guarantee the accuracy of factory-provided information or third-party data
• You should seek professional advice for legal, financial, and compliance matters

We encourage all clients to visit factories in person when possible, request references, and start with smaller orders to build trust with new manufacturing partners.`,
  },
  {
    title: "Limitation of Liability",
    content: `Sourcery acts as a facilitator between brands and factories. While we vet our factory partners and provide quality control services, we are not liable for:

• Manufacturing defects beyond our inspection scope
• Delays caused by factory partners or shipping
• Losses due to force majeure events
• Indirect or consequential damages
• Accuracy of tools, calculators, or estimates provided on our platform
• Actions or omissions of factory partners
• Quality or suitability of products manufactured through partnerships formed on our platform`,
  },
  {
    title: "Dispute Resolution",
    content: `Any disputes arising from these terms or our services shall be resolved through:

1. Good faith negotiation between parties
2. Mediation by a mutually agreed mediator
3. Binding arbitration if mediation fails

The arbitration shall be conducted in San Francisco, California.`,
  },
  {
    title: "Indemnification",
    content: `You agree to indemnify and hold harmless Sourcery, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, or expenses (including reasonable attorney's fees) arising from:

• Your use of the platform or services
• Your violation of these Terms of Service
• Manufacturing agreements entered through our platform
• Your infringement of any third party's rights
• Any content or materials you submit to the platform`,
  },
  {
    title: "Termination",
    content: `Sourcery reserves the right to suspend or terminate your account at any time for:

• Violation of these Terms of Service
• Fraudulent or illegal activity
• Non-payment of fees owed
• At our discretion with reasonable notice

Upon termination, you must settle any outstanding payments. Access to platform features and data may be revoked.`,
  },
  {
    title: "Modifications",
    content: `We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notification. Continued use of our services after changes constitutes acceptance of modified terms.`,
  },
  {
    title: "Governing Law",
    content: `These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to conflict of law principles. Any disputes arising from these terms or your use of our services shall be resolved through binding arbitration in San Francisco, California, or in the state or federal courts located therein.`,
  },
  {
    title: "Contact Information",
    content: `For questions about these Terms of Service, please contact:

Email: legal@sourcery.com
Address: 123 Manufacturing Way, San Francisco, CA 94102`,
  },
];

export default function Terms() {
  return (
    <Layout>
      <SEO
        title="Terms of Service | Sourcery"
        description="Read the terms and conditions governing your use of Sourcery's manufacturing sourcing platform and services."
        canonical="/terms"
      />
      
      <section className="section-padding">
        <div className="container-tight">
          <div className="mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          
          <div className="prose prose-neutral max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              These Terms of Service govern your use of Sourcery's platform and services. Please read them carefully before using our services.
            </p>
            
            <div className="space-y-10">
              {sections.map((section, index) => (
                <div key={index}>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
