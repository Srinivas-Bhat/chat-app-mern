import {  HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Image,
  Menu,
  MenuDivider,
  MenuItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useRef } from "react";
import ProfileModal from "./ProfileModal";
import { ChatContext } from "../Context/ChatProvider";
import logo from "./Assets/chatLogo.png";

const HamburgerDrawer = ({ handleLogout }) => {
  const hamburgerRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } =
    useContext(ChatContext);


  return (
    <>
      <IconButton ref={hamburgerRef}>
        <HamburgerIcon fontSize="xl" onClick={onOpen} />
      </IconButton>

      <Drawer
        isOpen={hamburgerRef.current && isOpen}
        placement="right"
        onClose={hamburgerRef.current && onClose}
        finalFocusRef={hamburgerRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
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
          </DrawerHeader>

          <DrawerBody>
            <Menu>
              <ProfileModal user={user}>
                <MenuItem _hover={{ backgroundColor: "#E0E0E0" }}>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem _hover={{ backgroundColor: "#E0E0E0" }} onClick={handleLogout}>
                Logout{" "}
              </MenuItem>
            </Menu>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default HamburgerDrawer;
