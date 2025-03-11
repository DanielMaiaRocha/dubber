import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import { useChatStore } from "../stores/useChatStore";

const ChatPag = () => {
  const { id } = useParams();
  const { user } = useUserStore();
  const {
    conversation,
    messages,
    fetchChatData,
    sendMessage,
    setTyping,
    typing,
    loading,
    error,
    connectSSE,
    disconnectSSE,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  // Conectar ao SSE e buscar mensagens
  useEffect(() => {
    if (id) {
      fetchChatData(id); // Busca os dados do chat
      connectSSE(id); // Conecta ao SSE
    }
    return () => disconnectSSE(); // Desconecta ao desmontar o componente
  }, [id, fetchChatData, connectSSE, disconnectSSE]);

  // Rolar para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      await sendMessage(id, newMessage);
      setNewMessage("");
      setTyping(id, false);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    setTyping(id, e.target.value.trim() !== "");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Função para encontrar o outro participante
  const getOtherParticipant = (participants) => {
    if (!participants || participants.length === 0) return null;
    return participants.find((participant) => participant._id !== user._id);
  };

  // Definir o nome e a foto de perfil do destinatário
  const otherParticipant = getOtherParticipant(conversation?.participants);
  const recipientName = otherParticipant?.name || "Carregando...";
  const recipientImage = otherParticipant?.profilePic || "/images/default-avatar.png";

  // Depuração: Verificar os dados da conversa e do destinatário
  console.log("Conversation:", conversation);
  console.log("Other Participant:", otherParticipant);
  console.log("Recipient Name:", recipientName);

  return (
    <div id="chat" className="mt-20 flex justify-center">
      <div id="container" className="w-full md:w-[900px] m-4 md:m-12 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b">
          <Link to="/messages" className="text-gray-500 hover:text-gray-700 flex items-center">
            <ArrowLeft size={20} className="mr-2" /> Voltar para mensagens
          </Link>
          <h2 className="text-lg font-semibold">
            Conversa com {recipientName}
          </h2>
        </div>

        <div id="messages" className="my-8 p-4 flex flex-col gap-4 h-[400px] overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-500">Carregando mensagens...</p>
          ) : error ? (
            <p className="text-center text-red-500">Erro ao carregar mensagens.</p>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const isCurrentUser = msg.userId === user._id;
              const sender = isCurrentUser ? user : otherParticipant;
              const senderName = sender?.name || "Usuário Desconhecido";
              const senderImage = sender?.profilePic || "/images/default-avatar.png";

              return (
                <motion.div
                  key={msg._id}
                  className={`flex gap-4 max-w-[600px] ${isCurrentUser ? "self-end flex-row-reverse" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={senderImage}
                    alt="Avatar"
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <div className={`p-4 rounded-lg ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    <p>{msg.text}</p>
                    <span className="text-xs text-gray-400 block mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">Nenhuma mensagem ainda.</p>
          )}

          {/* Animação "digitando..." */}
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

        <hr className="border-gray-300" />
        <div id="textsec" className="flex flex-row justify-between items-center mt-4">
          <textarea
            placeholder="Escreva uma mensagem..."
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={handleKeyPress}
            className="w-[75%] h-12 p-3 border border-gray-300 rounded-lg resize-none"
          ></textarea>
          <button
            className="w-24 p-2 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send size={18} className="mr-1" /> Enviar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPag;