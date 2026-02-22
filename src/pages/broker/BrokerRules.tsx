import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import {
  CheckCircle2, XCircle, ShieldCheck, FileText, Clock, AlertTriangle
} from "lucide-react";

const requirements = [
  "You must own or have legal management rights over the hostel you are listing.",
  "The hostel must be physically located near Kyambogo University or its surrounding areas.",
  "You must provide your full legal name, a working phone number, and a valid email address.",
  "Your hostel must have at least one verified room type with accurate pricing.",
  "You must upload real photos of your hostel — stock or fake images will be rejected.",
  "You agree to keep your listing information up-to-date at all times.",
  "You must respond promptly to student inquiries via the platform.",
];

const rules = [
  { icon: ShieldCheck, title: "Honesty is mandatory", text: "All prices, amenities, and availability must be truthful. Misleading listings will be removed immediately." },
  { icon: FileText, title: "Complete profile required", text: "You must fully complete your broker profile before your hostel is reviewed for approval." },
  { icon: Clock, title: "Approval takes 24–48 hours", text: "After signing up, your account will be reviewed by our admin team before you can manage listings." },
  { icon: AlertTriangle, title: "Violations lead to suspension", text: "Admin reserves the right to freeze or permanently ban accounts that violate platform rules." },
];

const notAllowed = [
  "Listing hostels you do not own or manage.",
  "Posting false availability or pricing.",
  "Uploading stock images or deceptive photos.",
  "Creating multiple accounts for the same hostel.",
  "Soliciting students outside the platform after contact.",
];

const BrokerRules = () => {
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const bothAccepted = acceptedTerms && acceptedPrivacy;

  const handleCreateAccount = () => {
    setAttemptedSubmit(true);
    if (bothAccepted) {
      navigate("/owner");
    } else {
      // Shake effect logic handled by className
      setTimeout(() => setAttemptedSubmit(false), 500);
      setTimeout(() => setAttemptedSubmit(true), 50);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero with image */}
      <section className="relative overflow-hidden bg-[#1B4FA8] text-white">
        <img
          src="/images/account.jpg"
          alt="Hostel brokers"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/55" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 py-14 md:py-20">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            Become a hostel broker
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl leading-relaxed">
            Before creating your account, please review the requirements and platform rules below. Admin approval is required before you can access your broker dashboard.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Requirements */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#1B4FA8]" />
            Requirements to register
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-4 p-5">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#1B4FA8]">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{req}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Rules */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#1B4FA8]" />
            Platform rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rules.map((rule) => {
              const Icon = rule.icon;
              return (
                <div key={rule.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-[#1B4FA8]" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">{rule.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{rule.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Not Allowed */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            What is not allowed
          </h2>
          <div className="bg-red-50 border border-red-100 rounded-2xl divide-y divide-red-100">
            {notAllowed.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5">
                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Admin Rights Notice */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex gap-4 items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1 text-sm">Admin rights</h3>
            <p className="text-sm text-yellow-700 leading-relaxed">
              The HostelConnect admin team reserves the right to <strong>approve, freeze, or permanently ban</strong> any broker account at any time for violations of these rules.
            </p>
          </div>
        </section>

        {/* Agreement Checkboxes + CTA */}
        <section className={`bg-white rounded-2xl shadow-sm border p-8 space-y-5 transition-all ${
          attemptedSubmit && !bothAccepted ? "border-red-300 animate-shake" : "border-gray-100"
        }`}>
          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-4px); }
              75% { transform: translateX(4px); }
            }
            .animate-shake {
              animation: shake 0.2s ease-in-out 0s 2;
            }
          `}</style>
          <h2 className="text-base font-semibold text-gray-700">Confirm your agreement</h2>
          <p className="text-sm text-gray-500">
            You must read and accept both documents before creating your account.
          </p>

          {/* Terms checkbox */}
          <div 
            onClick={() => setAcceptedTerms(!acceptedTerms)}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="relative mt-0.5">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  acceptedTerms
                    ? "bg-[#1B4FA8] border-[#1B4FA8]"
                    : attemptedSubmit && !acceptedTerms
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 group-hover:border-[#1B4FA8]"
                }`}
              >
                {acceptedTerms && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700 leading-relaxed select-none">
              I have read and agree to the{" "}
              <a 
                href="/terms" 
                target="_blank" 
                onClick={(e) => e.stopPropagation()}
                className="text-[#1B4FA8] underline font-medium hover:text-blue-800"
              >
                Terms of Service
              </a>
            </span>
          </div>

          {/* Privacy checkbox */}
          <div 
            onClick={() => setAcceptedPrivacy(!acceptedPrivacy)}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="relative mt-0.5">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  acceptedPrivacy
                    ? "bg-[#1B4FA8] border-[#1B4FA8]"
                    : attemptedSubmit && !acceptedPrivacy
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 group-hover:border-[#1B4FA8]"
                }`}
              >
                {acceptedPrivacy && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700 leading-relaxed select-none">
              I have read and agree to the{" "}
              <a 
                href="/privacy" 
                target="_blank" 
                onClick={(e) => e.stopPropagation()}
                className="text-[#1B4FA8] underline font-medium hover:text-blue-800"
              >
                Privacy Policy
              </a>
            </span>
          </div>

          {/* Validation message */}
          {attemptedSubmit && !bothAccepted && (
            <p className="text-sm text-red-500 font-medium flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              You must accept both the Terms of Service and Privacy Policy to continue.
            </p>
          )}

          {/* Create account button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              onClick={handleCreateAccount}
              className={`inline-flex items-center justify-center gap-2 font-semibold px-10 py-3.5 rounded-full text-base transition-all shadow-md ${
                bothAccepted
                  ? "bg-[#1B4FA8] hover:bg-[#163d85] text-white cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
              }`}
            >
              Create my account
            </button>
            <a href="/" className="text-sm text-gray-400 hover:text-red-500 transition-colors">
              Cancel and go back
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BrokerRules;
