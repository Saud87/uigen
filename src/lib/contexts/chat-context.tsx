"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useChat as useAIChat } from "@ai-sdk/react";
import { Message } from "ai";
import { useFileSystem } from "./file-system-context";
import { setHasAnonWork } from "@/lib/anon-work-tracker";

interface ChatContextProps {
  projectId?: string;
  initialMessages?: Message[];
}

interface ChatContextType {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
  projectId,
  initialMessages = [],
}: ChatContextProps & { children: ReactNode }) {
  const { fileSystem, handleToolCall } = useFileSystem();
  
  // Local state for input management (fallback for React 19 compatibility)
  const [localInput, setLocalInput] = useState("");

  const aiChatResult = useAIChat({
    api: "/api/chat",
    initialMessages,
    body: {
      files: fileSystem.serialize(),
      projectId,
    },
    onToolCall: ({ toolCall }) => {
      handleToolCall(toolCall);
    },
  });


  const {
    messages = [],
    input = "",
    handleInputChange,
    handleSubmit,
    status = "ready",
  } = aiChatResult;

  // Fallback handlers for React 19 compatibility issue
  const safeHandleInputChange = handleInputChange || ((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalInput(e.target.value);
  });

  const safeHandleSubmit = handleSubmit || ((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  });

  // Use local input if AI SDK input is undefined
  const actualInput = input ?? localInput;

  // Track anonymous work
  useEffect(() => {
    if (!projectId && messages.length > 0) {
      setHasAnonWork(messages, fileSystem.serialize());
    }
  }, [messages, fileSystem, projectId]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        input: actualInput,
        handleInputChange: safeHandleInputChange,
        handleSubmit: safeHandleSubmit,
        status,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}