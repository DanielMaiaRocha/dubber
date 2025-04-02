import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import { useChatStore } from "../stores/useChatStore";

const ChatPag = () => {
  const { id: conversationId } = useParams();
  const { user } = useUserStore();
  const {
    messages,
    fetchChatData,
    sendMessage,
    setTyping,
    typing,
    loading,
    error,
    chatDetails,
    joinConversation,
    leaveConversation,
    connectSocket,
    disconnectSocket,
    setupSocketListeners,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  // --- Efeitos para WebSocket --- //
  useEffect(() => {
    if (conversationId) {
      // Conecta ao WebSocket e configura listeners
      connectSocket();
      setupSocketListeners();
      joinConversation(conversationId);

      // Busca dados iniciais
      fetchChatData(conversationId);
    }

    return () => {
      // Limpeza ao sair do componente
      leaveConversation(conversationId);
      disconnectSocket();
    };
  }, [conversationId, connectSocket, setupSocketListeners, joinConversation, leaveConversation, disconnectSocket, fetchChatData]);

  // Rolagem automática para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Handlers --- //
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      await sendMessage(conversationId, user._id, newMessage);
      setNewMessage("");
      setTyping(conversationId, false);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    setTyping(conversationId, e.target.value.trim() !== "");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getParticipantById = (userId) => {
    return conversation?.participants?.find((p) => p._id === userId);
  };

  // --- Render (Layout IDÊNTICO ao original) --- //
  return (
    <div id="chat" className="mt-20 flex justify-center">
      <div id="container" className="w-[1300px] m-12">
        <span id="breadcrums" className="flex flex-row gap-1 font-semibold text-md text-[#555] shadow-lg border border-gray-50 rounded p-2">
          <Link to="/messages" className="hover:underline">Messages</Link>
          <span>{'>'} {chatDetails?.otherParticipant?.name || "Loading..."}</span>
        </span>

        <div id="messages" className="my-8 mx-0 p-12 flex flex-col gap-12 h-[500px] overflow-y-scroll">
          {loading ? (
            <p className="text-center text-gray-500">Carregando mensagens...</p>
          ) : error ? (
            <p className="text-center text-red-500">Erro ao carregar mensagens.</p>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const isCurrentUser = msg.senderId === user._id; // Note: Agora usa senderId (ajustado no modelo)
              const sender = isCurrentUser ? user : getParticipantById(msg.senderId);
              const senderImage = sender?.profilePic || "/images/default-avatar.png";

              return (
                <motion.div
                  key={msg._id}
                  id="item"
                  className={`flex gap-5 max-w-[600px] font-semibold ${isCurrentUser ? 'flex-row-reverse self-end' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={senderImage}
                    alt="Avatar"
                    className="rounded-full w-16 h-16 object-cover"
                    onError={(e) => {
                      e.target.src = "/images/default-avatar.png";
                    }}
                  />
                  <p className={`p-5 ${isCurrentUser ? 'bg-[#17a2b8] text-white rounded-se-none' : 'bg-[#e7e3e3] text-[#555] rounded-ss-none'} rounded-lg`}>
                    {msg.text}
                  </p>
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">Nenhuma mensagem ainda.</p>
          )}

          {typing && (
            <motion.div
              className="text-gray-500 flex items-center ml-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-400">.</span>
              <span className="ml-2">Digitando...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <hr className="h-0 border-[0.5px] border-solid mb-5" />
        <div id="textsec" className="flex flex-row justify-center items-center gap-10">
          <textarea
            placeholder="write a message"
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={handleKeyPress}
            cols={30}
            rows={10}
            className="w-[80%] h-28 p-3 border border-[lightgray] rounded-lg resize-none"
          ></textarea>
          <button
            className="w-36 p-2 rounded-lg text-white font-semibold bg-[#17a2b8] flex items-center justify-center gap-2"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send size={18} /> Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPag;