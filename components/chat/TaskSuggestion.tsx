import { Button } from "@/components/ui/button";

interface TaskSuggestion {
  title: string;
  description: string;
  columnId: string;
}

interface Props {
  suggestions: TaskSuggestion[];
  onAccept: (tasks: TaskSuggestion[]) => void;
  onReject: () => void;
}

export function TaskSuggestion({ suggestions, onAccept, onReject }: Props) {
  return (
    <div className="border rounded-lg p-4 my-4 bg-gray-50 dark:bg-gray-800">
      <h3 className="font-semibold mb-2">Suggested Tasks:</h3>
      <ul className="space-y-2 mb-4">
        {suggestions.map((task, index) => (
          <li key={index} className="border-l-2 border-blue-500 pl-2">
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {task.description}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Button onClick={() => onAccept(suggestions)} variant="default">
          Accept Tasks
        </Button>
        <Button onClick={onReject} variant="outline">
          Reject
        </Button>
      </div>
    </div>
  );
}
