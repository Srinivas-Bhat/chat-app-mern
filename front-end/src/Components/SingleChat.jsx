import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getAllSender } from "../utils/ChatHelper";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import "../styles/message.css";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const toast = useToast();

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        // console.log(data);
        setNewMessage("");
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    setLoading(true);
    const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
    console.log(data)

    setMessages(data);
    setLoading(false);
    try {
    } catch (error) {
      setLoading(false)
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicatior
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat])

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getAllSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* message here  */}
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">{/* Messages  */}
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3}>
            Click on the user to start chating
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
