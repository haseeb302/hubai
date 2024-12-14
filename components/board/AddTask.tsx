"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface AddTaskProps {
  columnId: string;
  onAdd: (task: { title: string; description: string; status: string }) => void;
}

export function AddTask({ columnId, onAdd }: AddTaskProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      status: columnId,
    });

    setTitle("");
    setDescription("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <div className="mt-2 z-10">
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-secondary w-full"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-2 rounded-md border border-input bg-background"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full p-2 rounded-md border border-input bg-background resize-none"
          rows={3}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
