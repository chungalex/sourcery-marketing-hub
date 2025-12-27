import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, submit a sourcing request, apply as a factory partner, or contact us for support. This may include:

• Name and contact information (email, phone, address)
• Company details and business information
• Production requirements and specifications
• Payment and billing information
• Communications with our team`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Match brands with appropriate factory partners
• Process transactions and send related information
• Send technical notices, updates, and support messages
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions`,
  },
  {
    title: "Information Sharing",
    content: `We may share information about you as follows:

• With factory partners to facilitate production requests
• With service providers who perform services on our behalf
• In response to a request for information if required by law
• If we believe disclosure is necessary to protect our rights
• In connection with a merger, acquisition, or sale of assets
• With your consent or at your direction`,
  },
  {
    title: "Data Security",
    content: `We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. We use industry-standard encryption and security protocols to safeguard your data. However, no method of transmission over the Internet is 100% secure.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to:

• Access the personal information we hold about you
• Request correction of inaccurate information
• Request deletion of your personal information
• Object to processing of your personal information
• Request restriction of processing
• Request data portability
• Withdraw consent at any time`,
  },
  {
    title: "Cookies",
    content: `We use cookies and similar tracking technologies to collect and track information and to improve and analyze our service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy, please contact us at:

Email: privacy@sourcery.com
Address: 123 Manufacturing Way, San Francisco, CA 94102`,
  },
];

export default function Privacy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy | Sourcery"
        description="Learn how Sourcery collects, uses, and protects your personal information. We are committed to safeguarding your privacy."
        canonical="/privacy"
      />
      
      <section className="section-padding">
        <div className="container-tight">
          <div className="mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          
          <div className="prose prose-neutral max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              At Sourcery, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
            </p>
            
            <div className="space-y-10">
              {sections.map((section, index) => (
                <div key={index}>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    {section.title}
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
