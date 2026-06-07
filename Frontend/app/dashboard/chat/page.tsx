"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const previousMonthRef = useRef(month);
const previousYearRef = useRef(year);

  // ---------------- LOAD CHAT ----------------
useEffect(() => {
  const chatKey = `finx-chat-${month}-${year}`;

  const savedChat = localStorage.getItem(chatKey);

  if (savedChat) {
    setMessages(JSON.parse(savedChat));
  } else {
    setMessages([
      {
        role: "assistant",
        content:
          "👋 Welcome to FinX AI.\n\nI can analyze your expenses, budget, savings opportunities and spending habits.",
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      },
    ]);
  }
}, [month, year]);
useEffect(() => {
  const savedMonth = localStorage.getItem("finx-month");
  const savedYear = localStorage.getItem("finx-year");

  if (savedMonth) setMonth(Number(savedMonth));
  if (savedYear) setYear(Number(savedYear));
}, []);

  // ---------------- SAVE CHAT ----------------
useEffect(() => {
  const chatKey = `finx-chat-${month}-${year}`;

  localStorage.setItem(
    chatKey,
    JSON.stringify(messages)
  );
}, [messages, month, year]);
  // ---------------- MONTH CHANGE MESSAGE ----------------
useEffect(() => {
  if (
    previousMonthRef.current !== month ||
    previousYearRef.current !== year
  ) {
    const monthName = new Date(
      year,
      month - 1
    ).toLocaleString("default", {
      month: "long",
    });

    setMessages((prev) => [
      ...prev,
     {
  role: "system",
  content: `📅 Switched to ${monthName} ${year}. `,
  time: new Date().toLocaleTimeString(),
  date: new Date().toLocaleDateString(),
},
    ]);

    previousMonthRef.current = month;
    previousYearRef.current = year;
  }
}, [month, year]);

  useEffect(() => {
    localStorage.setItem("finx-month", month.toString());
    localStorage.setItem("finx-year", year.toString());
  }, [month, year]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const suggestions = [
    "Show my top spending category this month",
    "Break down my expenses by category",
    "Compare this month's spending pattern",
    "Suggest 3 ways to reduce my expenses",
    "Where am I wasting money the most?",
    "Am I over or under my budget this month?",
    "Show remaining budget and status",
    "Give me full financial analysis report",
    "What are my spending habits telling me?",
  ];

  const sendMessage = async (text?: string) => {
    const question = (text || input).trim();

    if (!question) return;

    setLoading(true);

 const userMessage = {
  role: "user",
  content: question,
  time: new Date().toLocaleTimeString(),
  date: new Date().toLocaleDateString(),
  month,
  year,
};

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      const result = await api.post("/chat", {
        message: question,
        month,
        year,
      });

      const reply =
        result?.reply ||
        result?.data?.reply ||
        "No response from backend";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch {
  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: "⚠️ Server Error",
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      month,
      year,
    },
  ]);
} finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
   localStorage.removeItem(
  `finx-chat-${month}-${year}`
);

   setMessages([
  {
    role: "assistant",
    content:
      "👋 Welcome to FinX AI.\n\nI can analyze your expenses, budgets, savings opportunities and spending habits.",
    time: new Date().toLocaleTimeString(),
  },
]);
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex flex-col relative overflow-hidden">

  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px]" />
    <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-blue-500/10 blur-[150px]" />
  </div>
      {/* HEADER */}
      
<div className="sticky top-0 z-20 bg-slate-950/70 backdrop-blur-xl border-b border-white/10 px-8 py-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">

          <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🤖 FinX AI Assistant
            </h1>

            <p className="text-slate-500 text-xs mt-1">
              Personal Expense Intelligence
            </p>
          </div>

          <div className="flex gap-3">

            <select
              value={month}
              onChange={(e) =>
                setMonth(Number(e.target.value))
              }
             className="
bg-slate-900/80
border
border-slate-700
px-4
py-2
rounded-xl
focus:outline-none
focus:border-cyan-500
"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) =>
                setYear(Number(e.target.value))
              }
              className="bg-slate-800 px-4 py-2 rounded-xl"
            >
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
            </select>

          <button
  onClick={() => {
  localStorage.removeItem(
  `finx-chat-${month}-${year}`
);

    setMessages([
      {
        role: "assistant",
        content:
          "👋 Welcome back to FinX AI.",
        time: new Date().toLocaleTimeString(),
      },
    ]);
  }}
 className="
px-5
rounded-xl
bg-red-500/10
border
border-red-500/30
hover:bg-red-500
transition-all
duration-300
"
>
  Reset
</button>

          </div>
        </div>
      </div>

      {/* SUGGESTIONS */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/40 backdrop-blur-xl overflow-x-auto">

        <div className="flex gap-2 flex-wrap">

          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => sendMessage(item)}
             className="
group
bg-slate-900/70
border
border-slate-700
hover:border-cyan-500
hover:bg-cyan-500/10
hover:text-cyan-400
hover:-translate-y-1
transition-all
duration-300
px-4
py-2
rounded-full
text-xs
"
            >
              {item}
            </button>
          ))}

        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10">

        <div className="
max-w-5xl
mx-auto
space-y-6
bg-slate-950/40
backdrop-blur-xl
border
border-slate-800
rounded-3xl
p-8
shadow-2xl
">
             {messages.map((msg, i) => {
  if (msg.role === "system") {
    return (
      <div
        key={i}
        className="flex justify-center"
      >
       <div className="
bg-slate-900/80
border
border-slate-700
text-slate-400
text-xs
px-4
py-2
rounded-full
backdrop-blur-md
">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div
      key={i}
      className={`flex ${
        msg.role === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div className="flex gap-3 max-w-[80%]">

        {msg.role === "assistant" && (
          <div className="
w-11
h-11
rounded-2xl
bg-gradient-to-br
from-cyan-500
to-blue-600
flex
items-center
justify-center
shadow-lg
shadow-cyan-500/30
">
            🤖
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 whitespace-pre-wrap shadow-lg ${
            msg.role === "user"
              ? "bg-cyan-600"
              : "bg-slate-900 border border-slate-800"
          }`}
        >
          <div className="text-[15px] leading-8">
            {msg.content}
          </div>

          <div className="text-xs text-slate-400 mt-2">
            {msg.time}
          </div>
        </div>

        {msg.role === "user" && (
          <div className="
w-11
h-11
rounded-2xl
bg-slate-800
border
border-slate-700
flex
items-center
justify-center
">
            👤
          </div>
        )}

      </div>
    </div>
  );
})}

          {loading && (
            <div className="flex gap-3">

              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                🤖
              </div>

              <div className="
bg-slate-900
border
border-slate-700
px-5
py-4
rounded-3xl
">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
                </div>
              </div>

            </div>
          )}

          <div ref={chatRef} />

        </div>
      </div>

      {/* INPUT */}
     <div className="
sticky
bottom-0
bg-slate-950/70
backdrop-blur-xl
border-t
border-slate-800
p-5
">
      <div className="max-w-5xl mx-auto flex gap-3">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            placeholder="Ask FinX about your spending..."
           className="
flex-1
bg-slate-900/70
border
border-slate-700
px-5
py-4
rounded-2xl
focus:outline-none
focus:border-cyan-500
focus:ring-2
focus:ring-cyan-500/20
transition
"
          />

          <button
            onClick={() => sendMessage()}
            className="
bg-gradient-to-r
from-cyan-500
to-blue-600
hover:scale-105
transition-all
duration-300
px-8
rounded-2xl
font-semibold
shadow-lg
shadow-cyan-500/30
"
          >
            Send
          </button>

        </div>
      </div>
    </div>
  );
}