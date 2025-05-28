import { useState, useRef } from "react";

export default function ChatBot() {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const outputRef = useRef(null);

  const enhancePrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setEnhancedPrompt("");
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a smart assistant that summarizes and improves user prompts. Make them clearer, concise, and more effective for use in AI models."
            },
            {
              role: "user",
              content: `Improve and summarize this prompt: ${prompt}`
            }
          ]
        })
      });

      const data = await res.json();
      const output = data.choices?.[0]?.message?.content;
      setEnhancedPrompt(output || "No response received.");
    } catch (err) {
      setEnhancedPrompt("Error fetching response.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      enhancePrompt();
    }
  };

  const copyToClipboard = () => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt);
      consol.log("Copied!");
      
    }
  };

  return (
    <div className="max-w-2xl  text-center  mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">🧠Prompt Enhancer Chatbot</h1>
      
      <textarea
        className="w-full p-2 bg-gray-300 border rounded"
        rows="4"
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      
      <button
        onClick={enhancePrompt}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Enhancing..." : "Enhance Prompt"}
      </button>
       <button className="px-4 py-2 m-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={
                    textarea => {
                        setPrompt("");
                        setEnhancedPrompt("");
                        setPrompt("");
                        setEnhancedPrompt("");
                    }
                    }>Clear</button>

      {enhancedPrompt && (
        <div className="p-4 border rounded bg-gray-300 space-y-2">
          <div className="flex justify-between items-center">
            <strong>Enhanced Prompt:</strong>
            <button
              onClick={copyToClipboard}
              className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-600"
            >
              Copy
            </button>
          </div>
          <p ref={outputRef} className="text-sm text-gray-800">{enhancedPrompt}</p>
        </div>
      )}
    </div>
  );
}
