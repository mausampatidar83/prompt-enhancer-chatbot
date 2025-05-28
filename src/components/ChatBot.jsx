import { useState } from "react";

export default function ChatBot() {
    const [prompt, setPrompt] = useState("");
    const [enhancedPrompt, setEnhancedPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const enhancePrompt = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // or "gpt-3.5-turbo"  or  "mistral". 
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant that rewrites prompts to be clearer, longer, and more detailed."
                        },
                        {
                            role: "user",
                            content: `Enhance this prompt: ${prompt}`
                        }
                    ]
                })
            });

            const data = await res.json();
            const output = data.choices?.[0]?.message?.content;
            setEnhancedPrompt(output || "No response");
        } catch (err) {
            setEnhancedPrompt("Error fetching response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 rounded-3xl text-center bg-gray-300 space-y-4">
            <h1 className="text-2xl font-bold text-center">🧠Prompt Enhancer Chatbot</h1>
            <textarea
                className="w-full p-2 border bg-gray-200 rounded"
                rows="4"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button
                onClick={enhancePrompt}
                disabled={loading}
                className="px-4 py-2 m-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                <div className="p-4 border rounded bg-gray-200">
                    <strong>Enhanced Prompt:</strong>
                    <p>{enhancedPrompt}</p>
                </div>
            )}
        </div>
    );
}
