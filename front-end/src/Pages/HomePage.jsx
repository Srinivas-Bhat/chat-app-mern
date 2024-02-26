import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Image,
} from "@chakra-ui/react";
import Login from "../Components/auth/Login";
import Signup from "../Components/auth/Signup";
import { useNavigate } from "react-router-dom";
import logo from "../Components/Assets/chatLogo.png"

const HomePage = () => {
  const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if(userInfo){
            navigate("/chat-page");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
            fontFamily="fantasy !important"
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
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1rem">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
