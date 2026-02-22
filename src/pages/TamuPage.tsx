import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Plus, Mic, ArrowUp, ChevronRight, ChevronLeft } from "lucide-react";
import { TamuIcon } from "@/components/TamuAssistant";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "hostel_carousel";
  data?: any;
}

const TamuPage = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm Tamu. I can help you find a hostel around Kyambogo, check prices, or help you list your property if you're a broker. What do you need help with?",
      type: "text",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      type: "text",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          id, name, location, images,
          rooms(price, type)
        `)
        .or(`name.ilike.%${userMsg.content}%,location.ilike.%${userMsg.content}%,description.ilike.%${userMsg.content}%`)
        .limit(3);
        
      if (error) throw error;
      
      let finalData = data;
      if (!finalData || finalData.length === 0) {
         const { data: fallback } = await supabase.from('hostels').select('id, name, location, images, rooms(price, type)').limit(3);
         finalData = fallback;
      }

      const formattedData = finalData?.map(h => {
         const price = (h.rooms as any)?.[0]?.price?.toLocaleString() || "N/A";
         return {
           name: h.name,
           price: price,
           location: h.location,
           image: h.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&q=80'
         };
      }) || [];

      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Here is what I found based on "${userMsg.content}":`,
        type: "hostel_carousel",
        data: formattedData,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: "assistant", content: "Sorry, I had trouble searching right now.", type: "text"
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative h-[calc(100vh-64px)]">
        
        {/* Back Button Header */}
        <div className="w-full px-6 md:px-8 pt-4 pb-2 flex items-center shrink-0 gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-[#1B4FA8] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#163d85] hover:scale-105 transition-all flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 mr-0.5" strokeWidth={2.5} />
          </button>
          <span className="text-sm font-medium text-[#1B4FA8]">Back to previous page</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 pt-2 space-y-8 no-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-4 max-w-[88%] md:max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-white border border-gray-200" : "bg-transparent"}`}>
                  {msg.role === "assistant" ? <TamuIcon className="w-8 h-8" animate={true} /> : <div className="text-[10px] font-bold text-gray-400">Me</div>}
                </div>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl text-[15px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-white border border-gray-100 text-gray-800 rounded-tr-none shadow-sm"
                      : "bg-[#1B4FA8] text-white rounded-tl-none shadow-md"
                  }`}>
                    {msg.content}
                  </div>

                  {msg.type === "hostel_carousel" && (
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
                      {msg.data.map((item: any, idx: number) => (
                        <div key={idx} className="flex-shrink-0 w-60 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-blue-100 transition-colors">
                          <div className="h-32 relative overflow-hidden">
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-4">
                            <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                            <p className="text-xs text-gray-400 mb-2">{item.location}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-[#1B4FA8]">UGX {item.price}</span>
                              <ChevronRight className="w-4 h-4 text-gray-300" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <TamuIcon className="w-8 h-8" animate={true} />
                </div>
                <div className="bg-[#1B4FA8] p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Search Bar Container */}
        <div className="p-4 md:p-6 pt-0 shrink-0">
          <div className="relative max-w-3xl mx-auto">

            {/* Shimmer wave gradient INSIDE the search bar */}
            <div
              className={`relative rounded-[24px] flex items-center px-1 py-1 shadow-md overflow-hidden transition-all duration-300 bg-white border ${
                inputValue.trim() ? "border-gray-200" : "border-[#1B4FA8]/30"
              }`}
            >
              {/* The animated subtle wave background */}
              {!inputValue.trim() && (
                <div
                  className="absolute inset-0 opacity-[0.15] pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, #1B4FA8 30%, #facc15 50%, #1B4FA8 70%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'aiWave 4s linear infinite',
                  }}
                />
              )}

              {/* Input row */}
              <div className="relative flex items-center w-full z-10 bg-transparent">
                <button className="p-3 text-gray-400 hover:text-[#1B4FA8] transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything"
                  className="flex-1 bg-transparent border-none outline-none px-2 text-base text-gray-700 placeholder:text-gray-400 font-medium"
                />
                
                <div className="flex items-center gap-2 px-2">
                  <button className="p-2 text-gray-400 hover:text-[#1B4FA8] transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSend}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      inputValue.trim() 
                        ? "bg-[#1B4FA8] text-white shadow-lg scale-100 active:scale-95" 
                        : "bg-gray-200 text-gray-400 scale-95 opacity-50"
                    }`}
                  >
                    <ArrowUp className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-center text-gray-400 mt-3 font-medium">Tamu is an assistant and can make mistakes. Verify important info.</p>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes aiGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes aiWave {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default TamuPage;
