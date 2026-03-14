import { ExternalLink, MailOpen, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import { api } from "../../api/client";
import type { ContactMessage } from "../../types";

export function MessagesManager({
  token,
  messages,
  onMessagesChange
}: {
  token: string;
  messages: ContactMessage[];
  onMessagesChange: (messages: ContactMessage[]) => void;
}) {
  const [selected, setSelected] = useState<ContactMessage | null>(
    messages[0] ?? null
  );

  async function updateMessage(
    message: ContactMessage,
    payload: { status: string; is_read: boolean }
  ) {
    const updated = await api.updateMessage(token, message.id, payload);
    onMessagesChange(messages.map((m) => (m.id === updated.id ? updated : m)));
    if (selected?.id === updated.id) setSelected(updated);
  }

  async function deleteMessage(messageId: number) {
    if (!window.confirm("Delete this message?")) return;
    await api.deleteMessage(token, messageId);
    const remaining = messages.filter((m) => m.id !== messageId);
    onMessagesChange(remaining);
    setSelected(remaining[0] ?? null);
  }

  if (messages.length === 0) {
    return (
      <div className="glass-card flex items-center justify-center p-16 text-slate-500 text-sm">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex h-[calc(100vh-180px)] min-h-[400px]">
        {/* ── Left inbox list ── */}
        <aside className="w-72 shrink-0 overflow-y-auto border-r border-white/10">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Inbox ({messages.length})
            </p>
          </div>
          <ul>
            {messages.map((msg) => (
              <li key={msg.id}>
                <button
                  type="button"
                  onClick={async () => {
                    setSelected(msg);
                    if (!msg.is_read)
                      await updateMessage(msg, { status: msg.status, is_read: true });
                  }}
                  className={`flex w-full flex-col gap-1 border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5 ${
                    selected?.id === msg.id ? "bg-white/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-slate-200">
                      {msg.name}
                    </span>
                    {!msg.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-coral" />
                    )}
                  </div>
                  <span className="truncate text-xs text-slate-400">{msg.subject}</span>
                  <span className="text-[10px] text-slate-600">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Right message detail ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 flex-col overflow-hidden"
            >
              {/* Message header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {selected.subject}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    From: {selected.name}{" "}
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-cyan hover:underline"
                    >
                      &lt;{selected.email}&gt;
                    </a>
                    {" · "}
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selected.status}
                    onChange={(e) =>
                      updateMessage(selected, {
                        status: e.target.value,
                        is_read: selected.is_read
                      })
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 outline-none"
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      updateMessage(selected, {
                        status: selected.status,
                        is_read: !selected.is_read
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:text-white"
                  >
                    <MailOpen size={13} />
                    {selected.is_read ? "Mark unread" : "Mark read"}
                  </button>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyan/30 bg-cyan/10 px-3 py-2 text-xs text-cyan transition hover:bg-cyan/20"
                  >
                    <ExternalLink size={13} />
                    Reply
                  </a>
                  <button
                    type="button"
                    onClick={() => deleteMessage(selected.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400 transition hover:bg-rose-500/20"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Message body */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <p className="text-sm leading-8 text-slate-300 whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
