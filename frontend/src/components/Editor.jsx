import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/socketContext.jsx";

export default function Editor({ value, onChange, noteId }) {
  const [content, setContent] = useState(value || "");
  const socket = useSocket();
  const isRemoteUpdate = useRef(false);

  // Sync
  useEffect(() => {
    if (value !== content) {
      setContent(value || "");
    }
  }, [value]);

  // Join only if noteId valid
  useEffect(() => {
    if (!socket || !noteId) return;

    socket.emit("join-note", noteId);

    return () => {
      socket.emit("leave-note", noteId);
    };
  }, [socket, noteId]);

  // RECEIVE
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (newContent) => {
      isRemoteUpdate.current = true;

      setContent((prev) => {
        if (prev === newContent) return prev;
        return newContent;
      });
    };

    socket.on("receive-update", handleReceive);

    return () => {
      socket.off("receive-update", handleReceive);
    };
  }, [socket]);

  //  SEND (only if noteId valid)
  useEffect(() => {
    if (!socket || !noteId) return;

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      socket.emit("edit-note", { noteId, content });
    }, 300);

    return () => clearTimeout(timeout);
  }, [content, socket, noteId]);

  const handleChange = (e) => {
    const val = e.target.value;
    setContent(val);
    onChange(val);
  };

  return (
    <textarea
      className="form-control"
      rows="10"
      value={content}
      onChange={handleChange}
    />
  );
}