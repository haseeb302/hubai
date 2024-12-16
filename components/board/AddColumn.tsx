"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface AddColumnProps {
  onAdd: (title: string) => void;
}

export function AddColumn({ onAdd }: AddColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title.trim());
    setTitle("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="h-full min-w-[250px] flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
      >
        <Plus className="h-5 w-5" />
        <span className="ml-2">Add Column</span>
      </button>
    );
  }

  return (
    <div className="w-[250px] p-2 bg-card rounded-lg border">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Column title"
          className="w-full p-2 rounded-md border bg-background"
          autoFocus
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
