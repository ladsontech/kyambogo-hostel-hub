import { useNavigate, useLocation } from "react-router-dom";

export const TamuIcon = ({ className = "w-8 h-8", animate = false }: { className?: string; animate?: boolean }) => (
  <img
    src="/images/tamu_ai_logo.png?v=7"
    alt="Tamu AI"
    className={`object-contain ${className} ${animate ? "animate-[spin_8s_linear_infinite]" : ""}`}
  />
);

export const TamuAssistant = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/tamu" || location.pathname === "/heco") return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] group">
      {/* Hover preview card — simple, light, no bold border */}
      <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-1 group-hover:translate-y-0">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-100 px-3.5 py-2 rounded-xl shadow-md whitespace-nowrap">
          <p className="text-[10px] text-gray-400 mb-0.5">Need help?</p>
          <p className="text-sm font-medium text-[#1B4FA8]">Chat with Tamu</p>
        </div>
        <div className="w-2 h-2 bg-white border-r border-b border-gray-100 rotate-45 ml-auto mr-5 -mt-1" />
      </div>

      {/* Button - Just the logo, no surrounding circle background */}
      <button
        onClick={() => navigate("/tamu")}
        className="relative w-16 h-16 flex items-center justify-center transition-transform duration-500 hover:scale-110 active:scale-95 drop-shadow-lg group-hover:drop-shadow-xl"
      >
        <TamuIcon className="w-16 h-16 drop-shadow-md" animate={true} />

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </button>
    </div>
  );
};
