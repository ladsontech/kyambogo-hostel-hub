import { useState } from "react";
import { Header } from "@/components/Header";
import {
  ChevronDown, ChevronUp, Send, Phone,
  Building2, Search, Star, AlertTriangle
} from "lucide-react";

const faqs = [
  {
    question: "How do I find a hostel near Kyambogo University?",
    answer:
      "Use the search bar at the top of the page to search by hostel name, location, or features. You can also browse all available hostels from the Hostels page and filter by room type, price, or amenities.",
  },
  {
    question: "How do I contact a hostel owner?",
    answer:
      "Open any hostel listing and you will find the owner's contact details and a WhatsApp button. Click on it to directly reach the hostel owner for inquiries, booking, or availability.",
  },
  {
    question: "I want to list my hostel — how do I become a broker?",
    answer:
      "Click on 'Account' in the navigation, read through the platform requirements and rules, then click 'I Agree — Create My Account'. You'll sign in with Google and your account will be reviewed by our admin team within 24–48 hours.",
  },
  {
    question: "Why can't I access my broker dashboard?",
    answer:
      "After registering, your account must be approved by our admin team before you can access the full dashboard. This ensures the quality of listings on the platform. You will see a 'Pending Approval' screen until your account is verified.",
  },
  {
    question: "How do I order gas from Flamia?",
    answer:
      "Visit flamia.ug directly through the link on our Services page. Flamia is a separate gas delivery partner — they handle all gas cylinder orders and deliveries to hostel locations.",
  },
  {
    question: "My hostel listing has wrong information. What do I do?",
    answer:
      "Log in to your broker dashboard, navigate to your hostel details, and update the relevant information. Changes are reflected immediately. If you face any issues, use the contact form below to reach us.",
  },
  {
    question: "How do I report a hostel with fake or misleading information?",
    answer:
      "Use the contact form below and include the hostel name and a description of the issue. Our admin team will investigate within 48 hours and take appropriate action.",
  },
];

const quickLinks = [
  { icon: Building2, label: "Become a broker", desc: "Register your hostel on the platform", href: "/broker/rules" },
  { icon: Search, label: "Find hostels", desc: "Browse all listed hostels near Kyambogo", href: "/hostels" },
  { icon: Star, label: "Our services", desc: "See what services are available in hostels", href: "/services" },
];

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", category: "general", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", category: "general", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero with image */}
      <section className="relative h-[240px] md:h-[300px] overflow-hidden bg-[#1B4FA8]">
        <img
          src="/images/help.jpg"
          alt="Support team"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/55" />
        <div className="relative h-full max-w-4xl mx-auto px-6 lg:px-10 flex flex-col justify-center text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-md">How can we help?</h1>
          <p className="text-white/90 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Find answers to common questions or reach out to us directly.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* Quick help cards — White background */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.label}
                href={card.href}
                className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md flex items-start gap-4 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-[#1B4FA8]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{card.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
                </div>
              </a>
            );
          })}
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-4">Frequently asked questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-blue-50/50 transition-colors"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    <span className="text-sm font-medium text-gray-800 pr-4">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#1B4FA8] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Send us a message</h2>
          <p className="text-sm text-gray-500 mb-5">
            Our team will get back to you within 24 hours.
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 text-base mb-1">Message sent</h3>
              <p className="text-sm text-green-700 max-w-sm mx-auto">
                Thank you for reaching out. Our team will respond within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 text-sm text-[#1B4FA8] hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Your name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B4FA8]/30 focus:border-[#1B4FA8] transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Email address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B4FA8]/30 focus:border-[#1B4FA8] transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">Topic</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B4FA8]/30 focus:border-[#1B4FA8] transition bg-white"
                >
                  <option value="general">General inquiry</option>
                  <option value="broker">Broker / listing issue</option>
                  <option value="report">Report a hostel</option>
                  <option value="technical">Technical problem</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B4FA8]/30 focus:border-[#1B4FA8] transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-[#1B4FA8] hover:bg-[#163d85] text-white font-semibold px-7 py-3 rounded-full transition-colors shadow-sm text-sm"
              >
                <Send className="h-4 w-4" />
                Send message
              </button>
            </form>
          )}
        </section>

        {/* Direct Contact */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-semibold text-gray-800 mb-0.5 text-base">Still have questions?</h3>
            <p className="text-sm text-gray-500">Contact us directly via WhatsApp or Phone call for faster assistance.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/256793919128"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all shadow-sm hover:translate-y-[-2px]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="tel:+256789572007"
              className="inline-flex items-center gap-2 bg-[#1B4FA8] hover:bg-[#163d85] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all shadow-sm hover:translate-y-[-2px]"
            >
              <Phone className="h-5 w-5" />
              +256 789 572 007
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HelpPage;
