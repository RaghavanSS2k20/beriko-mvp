import { Input } from "@chakra-ui/react";
import { Search, ArrowRight } from "lucide-react";
import style from "@/styles/about.module.css";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { useNavbar } from "@/context/NavbarContext";

const AboutPage = () => {
  const bottomRef = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChat, setIsChat] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const router = useRouter();

  const { updateNavbar, resetNavbar } = useNavbar();

  useEffect(() => {
    const loadInitialSuggestions = async () => {
      const initial = await getSuggestions("");
      setSuggestions(initial);
    };

    updateNavbar({
      title: "Raghav0175",
      showChat: false,
      showFilter: false,
    });

    loadInitialSuggestions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSuggestions = async (question = "") => {
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (data.success) {
        return data.suggestions; // 👈 array of strings
      } else {
        console.error(data.error);
        return [];
      }
    } catch (err) {
      console.error("Suggestions error:", err);
      return [];
    }
  };

  const handleSend = async (customMessage) => {
    const message = customMessage || input;

    if (!message.trim()) return;

    if (!isChat) setIsChat(true);

    setInput("");

    // add user message
    setMessages((prev) => [...prev, { role: "user", text: message }]);

    // 👇 add temporary bot "thinking"
    setIsTyping(true);
    setMessages((prev) => [...prev, { role: "bot", text: "Thinking..." }]);

    try {
      const [reply, newSuggestions] = await Promise.all([
        sendMessage(message),
        // Promise.resolve(
        //   `Oh, Raghavan has some super interesting personal projects! First up, there's **Beriko** – and get this, it's an AI-powered dating platform that focuses on personality and meaningful connections, using cational tech to find better matches. How cool is that for a fresh take? Then he also built **Staybroke**, which is a personal and shared expense tracking tool that uses APIs and automation to make managing money way . He really loves building things from the ground up that solve real problems for people!,`,
        // ),
        getSuggestions(message),
      ]);

      setSuggestions(newSuggestions);

      // simulate delay for realism (optional)
      await new Promise((res) => setTimeout(res, 800));

      // 👇 replace last "Thinking..." message
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "bot", text: reply };
        return updated;
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: "Something went wrong",
        };
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };
  const sendMessage = async (question) => {
    try {
      const res = await fetch("/api/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (data.success) {
        console.log(data.response);
        return data.response;
      } else {
        console.error(data.error);
        return "Something went wrong";
      }
    } catch (err) {
      console.error(err);
      return "Server error";
    }
  };
  return (
    <div className={style.wrapper}>
      {/* 🔹 TOP AREA */}
      {!isChat ? (
        <div className={style.container}>
          <h1 className={style.heading}>
            know More about <span className={style.emphasis}>Raghavan!</span>
          </h1>
          <p className={style.subheading}>
            Learn more about him by chatting with this Beriko profile.
          </p>
        </div>
      ) : (
        <div className={style.chatContainer}>
          <div className={style.chatMessages}>
            {messages.map((msg, index) => (
              <div key={index} className={style.message}>
                <p
                  className={
                    msg.role === "user" ? style.userMessage : style.botMessage
                  }
                >
                  <ReactMarkdown
                    components={{
                      strong: ({ children }) => (
                        <span className={style.emphasisBold}>{children}</span>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {/* 🔥 ALWAYS VISIBLE BOTTOM OVERLAY */}
      <div className={style.bottomSection}>
        <div className={style.tags}>
          {suggestions.map((s, i) => (
            <div key={i} className={style.tag} onClick={() => handleSend(s)}>
              {s}
            </div>
          ))}
        </div>

        <div className={style.searchBox}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className={style.searchInput}
            placeholder="Ask about his work, projects, ideas..."
          />

          <button onClick={handleSend} className={style.searchButton}>
            <ArrowRight size={20} />
          </button>
        </div>

        <div className={style.footer}>
          Learn More About{" "}
          <span
            onClick={() => router.push("/hi")}
            style={{ cursor: "pointer" }}
            className={style.emphasis}
          >
            Beriko
          </span>
        </div>
      </div>
    </div>
  );
};

AboutPage.noMobileContainer = true;

export default AboutPage;
