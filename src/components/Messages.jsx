import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useChatStore } from "../stores/useChatStore";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

const Messages = () => {
  const { user } = useUserStore();
  const { conversations, fetchConversations, loading, error } = useChatStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const totalPages = Math.ceil(conversations.length / pageSize);
  const displayedConversations = conversations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Função mais robusta para encontrar o outro participante
  const getOtherParticipant = (conversation) => {
    if (!conversation?.participants) return null;

    // Verifica se os participants já estão populados
    const isPopulated = conversation.participants.some(
      (p) => typeof p !== "string"
    );

    if (!isPopulated) {
      console.warn("Participants não populados:", conversation);
      return null;
    }

    return conversation.participants.find(
      (participant) => participant._id !== user._id
    );
  };

  // Formatação segura da data
  const formatDate = (dateString) => {
    if (!dateString) return "Indisponível";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Indisponível";
    }
  };

  return (
    <div className="mt-72 flex justify-center mb-96">
      <div className="w-full max-w-5xl p-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Histórico de Conversas</h1>
          <Link
            to="/confirmations"
            className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white"
          >
            Confirmações
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">
            Erro ao carregar conversas: {error}
          </p>
        ) : displayedConversations.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhuma conversa encontrada
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Contato</th>
                <th className="p-3">Última Mensagem</th>
                <th className="p-3">Data</th>
                <th className="p-3">Ação</th>
              </tr>
            </thead>
            <tbody>
              {displayedConversations.map((chat) => {
                const otherParticipant = getOtherParticipant(chat);
                const lastMessage = chat.lastMessage || "---";

                return (
                  <tr key={chat._id} className="border-b hover:bg-gray-100">
                    <td className="p-3 flex items-center">
                      <img
                        src={
                          otherParticipant?.profilePic ||
                          "/images/default-avatar.png"
                        }
                        alt="Avatar"
                        className="rounded-full w-10 h-10 object-cover mr-3"
                        onError={(e) => {
                          e.target.src = "/images/default-avatar.png";
                        }}
                      />
                      <span>{otherParticipant?.name || "Usuário"}</span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {typeof lastMessage === "string"
                        ? lastMessage.substring(0, 30) +
                          (lastMessage.length > 30 ? "..." : "")
                        : "---"}
                    </td>
                    <td className="p-3">{formatDate(chat.updatedAt)}</td>
                    <td className="p-3">
                      <Link
                        to={`/chat/${chat._id}`}
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                        title="Abrir conversa"
                      >
                        <MessageCircle size={20} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Paginação permanece igual */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="mx-4">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
