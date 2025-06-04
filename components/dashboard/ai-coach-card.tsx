import { Card } from "../shared";

interface AIMessage {
  id: string;
  text: string;
}

interface AICoachCardProps {
  messages: AIMessage[];
}

export function AICoachCard({ messages }: AICoachCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-stone-900">title</h2>
        <div className="bg-yellow-200 text-xs font-medium text-stone-900 px-2 py-1 rounded-full">
          nutritionCoach
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-gray-100 rounded-xl rounded-tl-none p-4"
          >
            <p className="text-sm text-gray-700">{message.text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <input
          type="text"
          placeholder="placeholder"
          className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-green-200"
        />
        <button className="bg-yellow-200 hover:bg-yellow-300 text-stone-900 px-4 py-2 rounded-r-full transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </Card>
  );
}
