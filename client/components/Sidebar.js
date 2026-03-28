"use client";

export default function Sidebar({
  chats,
  currentChatId,
  setCurrentChatId,
  createNewChat,
}) {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 border-r border-gray-700 flex flex-col">
      <button
        onClick={createNewChat}
        className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg mb-4"
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setCurrentChatId(chat._id)}
            className={`p-2 rounded-lg cursor-pointer mb-2 text-sm
              ${
                chat._id === currentChatId ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
          >
            {chat.title || "New Chat"}
          </div>
        ))}
      </div>
    </div>
  );
}
