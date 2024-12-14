import { Project } from "@/components/board/types";

interface Chat {
  id: string;
  name: string;
  lastMessageAt: Date;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  chatId: string; // Added to link messages to specific chats
}

export const initialProjects: Project[] = [
  {
    id: "project-1",
    name: "Development Project",
    columns: [
      { id: "todo", title: "To Do", order: 0 },
      { id: "in-progress", title: "In Progress", order: 1 },
      { id: "done", title: "Done", order: 2 },
    ],
    tasks: [
      {
        id: "1",
        title: "Implement authentication",
        description: "Add user login and registration",
        status: "todo",
      },
      // ... other tasks
    ],
  },
  {
    id: "project-2",
    name: "Marketing Project",
    columns: [
      { id: "backlog", title: "Backlog", order: 0 },
      { id: "in-review", title: "In Review", order: 1 },
      { id: "approved", title: "Approved", order: 2 },
      { id: "published", title: "Published", order: 3 },
    ],
    tasks: [],
  },
];

export const initialChats: Chat[] = [
  {
    id: "chat-1",
    name: "Team Standup",
    lastMessageAt: new Date("2024-03-10T10:00:00"),
  },
  {
    id: "chat-2",
    name: "Project Planning",
    lastMessageAt: new Date("2024-03-09T15:30:00"),
  },
  {
    id: "chat-3",
    name: "Design Review",
    lastMessageAt: new Date("2024-03-08T09:15:00"),
  },
];

export const initialMessages: Message[] = [
  // Chat 1 - Team Standup
  {
    id: "1-1",
    content: "Good morning team! What's everyone working on today?",
    role: "user",
    timestamp: new Date(Date.now() - 50000),
    chatId: "chat-1",
  },
  {
    id: "1-2",
    content: "I'm working on the authentication system. Should be done by EOD.",
    role: "assistant",
    timestamp: new Date(Date.now() - 40000),
    chatId: "chat-1",
  },

  // Chat 2 - Project Planning
  {
    id: "2-1",
    content: "Let's review the sprint goals for this week.",
    role: "user",
    timestamp: new Date(Date.now() - 30000),
    chatId: "chat-2",
  },
  {
    id: "2-2",
    content: "We need to prioritize the user dashboard features.",
    role: "assistant",
    timestamp: new Date(Date.now() - 20000),
    chatId: "chat-2",
  },

  // Chat 3 - Design Review
  {
    id: "3-1",
    content: "The new mockups are ready for review.",
    role: "user",
    timestamp: new Date(Date.now() - 15000),
    chatId: "chat-3",
  },
  {
    id: "3-2",
    content: "Great! The color scheme looks much better now.",
    role: "assistant",
    timestamp: new Date(Date.now() - 10000),
    chatId: "chat-3",
  },
];
