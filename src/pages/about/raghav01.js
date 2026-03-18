import { Input } from "@chakra-ui/react";
import { Search, ArrowRight } from "lucide-react";
import style from "@/styles/about.module.css";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const AboutPage = () => {
  const bottomRef = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChat, setIsChat] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!isChat) setIsChat(true); // 👈 switch UI

    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const reply = await sendMessage(userMessage);

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong" },
      ]);
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
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
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
          <div className={style.tag}>Iam A Recuirter</div>
          <div className={style.tag}>Just Want To Know About Him</div>
          <div className={style.tag}>How can I collaborate With Him?</div>
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
          Learn More About <span className={style.emphasis}>Beriko</span>
        </div>
      </div>
    </div>
  );
};

AboutPage.noMobileContainer = true;

export default AboutPage;
