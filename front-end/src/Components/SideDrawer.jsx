import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Show,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatContext } from "../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "../utils/ChatHelper";
import HamburgerDrawer from "./HamburgerDrawer";
import logo from "./Assets/chatLogo.png";

const badgeStyles = {
  position: "absolute",
  top: "-6px",
  right: "25px",
  padding: "5px 10px",
  borderRadius: "50%",
  backgroundColor: "red",
  color: "white",
  fontSize: "10px",
  fontWeight: "bold",
};

const SideDrawer = () => {
  const { user, setSelectedChat, chats, setChats, notification, setNotification } =
    useContext(ChatContext);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearch("");
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Oops, Error Occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Oops, Error fetching the chat!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Show above="sm">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          w="100%"
          p="5px 10px"
          borderWidth="5px"
        >
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <Text d={{ base: "none", md: "flex" }} px="4">
                Search User
              </Text>
            </Button>
          </Tooltip>

          <Text
            fontFamily="fantasy"
            fontSize="2xl"
            letterSpacing="2px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              fontFamily="Roboto"
              display="inline-block"
              src={logo}
              alt="logo"
              boxSize="45px"
              objectFit="contain"
            />
            Talk-A-Tive
          </Text>

          <div>
            <Menu>
              <MenuButton style={{ position: "relative", display: "inline-block" }} p={1}>
                {notification.length ? (
                  <span style={badgeStyles}>{notification.length} </span>
                ) : null}
                <BellIcon fontSize="2xl" m={1} />{" "}
              </MenuButton>
              <MenuList pl={2}>
                {!notification?.length && "No New Messages"}
                {notification.map((msg) => (
                  <MenuItem
                    key={msg._id}
                    onClick={() => {
                      setSelectedChat(msg.chat);
                      setNotification(notification.filter((n) => n !== msg));
                    }}
                  >
                    {msg.chat.isGroupChat
                      ? `New Message from ${msg.chat.chatName}`
                      : `New Message from ${getSender(user, msg.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Box>
      </Show>

      {/* below md screen */}
      <Show below="sm">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          w="100%"
          p="5px 10px"
          borderWidth="5px"
        >
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <Text display={{ base: "none", md: "flex" }} px="4">
                Search User
              </Text>
            </Button>
          </Tooltip>

          <Text
            fontFamily="fantasy"
            fontSize="2xl"
            letterSpacing="1px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Talk-A-Tive
          </Text>

          <div>
            <Menu>
              <MenuButton style={{ position: "relative", display: "inline-block" }} p={1}>
                {notification.length ? (
                  <span style={badgeStyles}>{notification.length} </span>
                ) : null}
                <BellIcon fontSize="2xl" m={1} />{" "}
              </MenuButton>
              <MenuList pl={2}>
                {!notification?.length && "No New Messages"}
                {notification.map((msg) => (
                  <MenuItem
                    key={msg._id}
                    onClick={() => {
                      setSelectedChat(msg.chat);
                      setNotification(notification.filter((n) => n !== msg));
                    }}
                  >
                    {msg.chat.isGroupChat
                      ? `New Message from ${msg.chat.chatName}`
                      : `New Message from ${getSender(user, msg.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <HamburgerDrawer handleLogout={handleLogout} />
          </div>
        </Box>
      </Show>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search name or email.."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
