"use client";
import React, { useState, useEffect } from "react";
// import Pusher from "pusher-js";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import Modal from "@/components/common/Modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle, Search, Paperclip, Plus, Smile } from "lucide-react";
import { ChatMessage } from "@/types";
import EmojiPicker from "emoji-picker-react";


const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Messagerie", isCurrent: true },
];

const initialConversations = [
  {
    id: 1,
    sender: "Alice",
    messages: [
      {
        id: 1,
        sender: "Alice",
        message: "Salut, comment ça va ?",
        timestamp: "2024-10-07 10:00",
        isMine: false,
      },
      {
        id: 2,
        sender: "Vous",
        message: "Tout va bien, merci !",
        timestamp: "2024-10-07 10:02",
        isMine: true,
      },
    ],
  },
];

const ChatPage = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConversation, setActiveConversation] = useState<number | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatRecipient, setNewChatRecipient] = useState("");

  // useEffect(() => {
  //   const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  //     cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
  //   });

  //   const channel = pusher.subscribe("chat-channel");
  //   channel.bind("new-message", (data: ChatMessage) => {
  //     setConversations((prevConversations) => {
  //       const updatedConversations = [...prevConversations];
  //       const convoIndex = updatedConversations.findIndex(
  //         (c) => c.sender === data.sender
  //       );

  //       if (convoIndex !== -1) {
  //         updatedConversations[convoIndex].messages.push(data);
  //       } else {
  //         updatedConversations.push({
  //           id: updatedConversations.length + 1,
  //           sender: data.sender,
  //           messages: [data],
  //         });
  //       }

  //       return updatedConversations;
  //     });
  //   });

  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };
  // }, []);

  const handleNewChat = () => {
    if (newChatRecipient.trim()) {
      const newConversation = {
        id: conversations.length + 1,
        sender: newChatRecipient,
        messages: [],
      };
      setConversations((prevConversations) => [
        ...prevConversations,
        newConversation,
      ]);
      setActiveConversation(conversations.length);
      setShowNewChatModal(false);
      setNewChatRecipient("");
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeConversation !== null) {
      // const messageData: ChatMessage = {
      //   id: conversations[activeConversation].messages.length + 1,
      //   sender: "Vous",
      //   message: newMessage,
      //   timestamp: new Date().toISOString(),
      //   isMine: true,
      // };

      // if (selectedFile) {
      //   console.log("Fichier à envoyer : ", selectedFile);
      //   setSelectedFile(null);
      // }

      // await fetch("/api/pusher", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(messageData),
      // });

      // setConversations((prevConversations) => {
      //   const updatedConversations = [...prevConversations];
      //   updatedConversations[activeConversation].messages.push(messageData);
      //   return updatedConversations;
      // });
      // setNewMessage("");
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Card className="px-3 py-2 flex h-screen bg-white dark:bg-gray-900 shadow-md rounded-lg">
        <div className="w-80 border-r rounded-l-md relative">
          <h2 className="text-2xl font-semibold font-fredoka text-indigo-500 mb-4 flex items-center">
            <MessageCircle size={25} className="mr-2" /> Messagerie
          </h2>
          <div className="relative p-2 border-b">
            <div className="absolute top-[18px] left-5 flex items-center">
              <Search className="text-gray-400 dark:text-gray-500" size={20} />
            </div>
            <Input
              placeholder="Rechercher une conversation"
              className="h-10 w-full pl-10 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2 p-4">
            {conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                className="flex items-center p-3 w-full hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => setActiveConversation(index)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
                <div className="flex flex-col">
                  <h3 className="font-semibold">{conversation.sender}</h3>
                  <p className="text-sm text-gray-600">
                    {
                      conversation.messages[conversation.messages.length - 1]
                        .message
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Floating Button for New Chat */}
          <Button
            onClick={() => setShowNewChatModal(true)}
            className="absolute bottom-2 right-2 px-3 py-4 bg-indigo-600 text-white rounded-full shadow-sm  hover:bg-indigo-700"
          >
            <Plus size={25} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col rounded-r-md">
          <div
            className={`flex items-center p-4 bg-indigo-500 text-white ${
              activeConversation === null ? "justify-center" : ""
            }`}
          >
            <h2 className="text-lg font-semibold">
              {activeConversation !== null
                ? conversations[activeConversation].sender
                : "Sélectionnez une conversation"}
            </h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            {activeConversation !== null &&
              conversations[activeConversation].messages.map(
                (message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.isMine ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        message.isMine
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <p className="font-bold">{message.sender}</p>
                      <p>{message.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )
              )}
            {activeConversation === null && (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageCircle size={50} className="text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Sélectionnez une conversation pour voir les messages.
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="flex items-center p-2 bg-gray-100 rounded">
              <p className="text-gray-500 mr-4">{selectedFile.name}</p>
              <Button
                onClick={() => setSelectedFile(null)}
                className="bg-red-500 text-white"
              >
                Annuler
              </Button>
            </div>
          )}

          <div className="flex items-center p-4 bg-white dark:bg-gray-900 border-t shadow-md rounded-b-md relative">
            <Button
              variant="ghost"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="mr-2 p-2 rounded-full hover:bg-gray-100"
            >
              <Smile size={22} className="text-gray-600" />
            </Button>

            {showEmojiPicker && (
              <div className="absolute bottom-20 z-50 bg-white dark:bg-gray-900">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}

            <label htmlFor="file-upload" className="mr-2 cursor-pointer">
              <Paperclip size={22} className="text-gray-600" />
              <Input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <Textarea
              placeholder="Écrire un message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 h-9 resize-none"
            />

            <Button
              onClick={handleSendMessage}
              className="ml-2 bg-indigo-600 text-white"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Card>

      {/* New Chat Modal using Modal component */}
      <Modal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        title="Nouvelle Conversation"
        content={
          <Input
            placeholder="Nom du destinataire"
            value={newChatRecipient}
            onChange={(e) => setNewChatRecipient(e.target.value)}
            className="mb-4"
          />
        }
        footer={
          <div className="flex justify-end">
            <Button
              onClick={handleNewChat}
              className="bg-indigo-600 text-white mr-2"
            >
              Créer
            </Button>
            <Button onClick={() => setShowNewChatModal(false)}>Annuler</Button>
          </div>
        }
      />
    </div>
  );
};

export default ChatPage;
