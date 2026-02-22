import { Header } from "@/components/Header";
import { Lock } from "lucide-react";

const sections = [
  {
    title: "1. Information we collect",
    body: "When you register as a broker, we collect your name, email address, phone number, and information about the hostel you manage. We also collect usage data such as pages visited and actions taken on the Platform.",
  },
  {
    title: "2. How we use your information",
    body: "We use your information to create and manage your broker account, review your registration for approval, display your hostel listing to students, and communicate with you about your account status and platform updates.",
  },
  {
    title: "3. Data sharing",
    body: "We do not sell your personal information to third parties. Your contact details may be shown to students who are viewing your hostel listing for the purpose of making inquiries. We may share data with platform administrators for the purpose of account review and moderation.",
  },
  {
    title: "4. Google authentication",
    body: "We use Google Sign-In for broker authentication. When you sign in with Google, we receive your name, email address, and profile photo from Google. We do not store your Google password.",
  },
  {
    title: "5. Data security",
    body: "We take reasonable measures to protect your personal data from unauthorised access, disclosure, or destruction. However, no internet transmission is completely secure and we cannot guarantee absolute security.",
  },
  {
    title: "6. Data retention",
    body: "We retain your account data for as long as your account is active. If your account is permanently banned or you request deletion, we will remove your personal data within 30 days, except where we are required by law to retain it.",
  },
  {
    title: "7. Your rights",
    body: "You have the right to access, correct, or delete your personal data. To make such a request, please contact us through the Help page. We will respond within 14 days.",
  },
  {
    title: "8. Cookies",
    body: "We use cookies and similar technologies to maintain your session and remember your preferences. You can disable cookies in your browser settings, but this may affect your ability to use the Platform.",
  },
  {
    title: "9. Changes to this policy",
    body: "We may update this Privacy Policy from time to time. Continued use of the Platform after changes are posted means you accept the updated policy.",
  },
  {
    title: "10. Contact us",
    body: "If you have any questions about this Privacy Policy, please reach us via the Help page or email support@kyambogohostelconnect.com.",
  },
];

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="relative h-[240px] md:h-[300px] overflow-hidden bg-[#1B4FA8]">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&q=80"
          alt="Privacy Policy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/50" />
        <div className="relative h-full max-w-4xl mx-auto px-6 lg:px-10 flex flex-col justify-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-md">Privacy Policy</h1>
          <p className="text-white/90 text-sm md:text-lg max-w-2xl leading-relaxed font-medium">
            Your privacy matters to us. Learn how we handle your data.
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
            By checking the Privacy Policy box during registration, you confirm you have read and understood this document.
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

export default PrivacyPage;
