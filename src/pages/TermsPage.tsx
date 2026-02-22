import { Header } from "@/components/Header";
import { ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of terms",
    body: "By accessing or using the Kyambogo Hostel Connect platform (\"the Platform\"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform.",
  },
  {
    title: "2. Eligibility",
    body: "To register as a broker, you must be at least 18 years of age and legally authorised to manage or own the hostel you are listing. By registering, you confirm that all information you provide is accurate and truthful.",
  },
  {
    title: "3. Broker responsibilities",
    body: "Brokers are responsible for maintaining accurate listing information including room availability, pricing, photos, and amenities. Any misleading, false, or outdated information is a violation of these terms and may result in account suspension.",
  },
  {
    title: "4. Account approval",
    body: "All broker accounts are subject to review and approval by the platform administrators. Approval is not guaranteed. The admin team may reject any application without providing a reason.",
  },
  {
    title: "5. Prohibited conduct",
    body: "You may not use the Platform to post fraudulent listings, impersonate other businesses, engage in spam, or solicit students outside the platform. Violations will result in immediate account termination.",
  },
  {
    title: "6. Admin rights",
    body: "Platform administrators reserve the right to approve, suspend, freeze, or permanently ban any broker account at any time, with or without prior notice, for any reason including but not limited to policy violations.",
  },
  {
    title: "7. Intellectual property",
    body: "All content on this Platform, including logos, text, graphics, and software, is the property of Kyambogo Hostel Connect. You may not reproduce, distribute, or use our content without written permission.",
  },
  {
    title: "8. Limitation of liability",
    body: "The Platform is provided 'as is'. We are not liable for any loss or damage resulting from your use of the Platform, including disputes between brokers and students.",
  },
  {
    title: "9. Changes to terms",
    body: "We reserve the right to modify these Terms at any time. Continued use of the Platform after changes are posted constitutes your acceptance of the revised Terms.",
  },
  {
    title: "10. Contact",
    body: "For any questions about these Terms, please contact us through the Help page or email us at support@kyambogohostelconnect.com.",
  },
];

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="relative h-[240px] md:h-[300px] overflow-hidden bg-[#1B4FA8]">
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&q=80"
          alt="Terms of Service"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/50" />
        <div className="relative h-full max-w-4xl mx-auto px-6 lg:px-10 flex flex-col justify-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-md">Terms of Service</h1>
          <p className="text-white/90 text-sm md:text-lg max-w-2xl leading-relaxed font-medium">
            Please read these terms carefully before creating a broker account.
          </p>
          <p className="text-white/70 text-xs mt-4">Last updated: February 2026</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {sections.map((s, i) => (
            <div key={i} className="p-7">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">{s.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            By checking the Terms of Service box during registration, you confirm you have read and understood this document.
          </p>
          <button
            onClick={() => window.close()}
            className="mt-4 inline-flex items-center gap-2 bg-[#1B4FA8] hover:bg-[#163d85] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            Close and go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
