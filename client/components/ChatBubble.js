"use client";

import ReactMarkdown from "react-markdown";

export default function ChatBubble({ role, content }) {
  return (
    <div
      className={`mb-4 flex ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xl p-3 rounded-xl text-sm whitespace-pre-wrap ${
          role === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-100"
        }`}
      >
        <ReactMarkdown
          components={{
            // 🔥 FIX: prevent <p> wrapping <pre>
            p({ children }) {
              return <div>{children}</div>;
            },

            // 🔥 FIX: code blocks
            code({ inline, children }) {
              return !inline ? (
                <pre className="bg-black p-3 rounded-lg overflow-x-auto">
                  <code>{children}</code>
                </pre>
              ) : (
                <code className="bg-gray-700 px-1 py-0.5 rounded">
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
