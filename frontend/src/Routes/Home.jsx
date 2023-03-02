import { ChatIcon } from '@chakra-ui/icons'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React from 'react'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Signin from '../Components/Auth/Signin'
import Signup from '../Components/Auth/Signup'

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (userInfo) {
      navigate("/chats")
    }
  }, [navigate])

  return (
    <Container maxW='xl' centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"#282c34"}
        w="100%"
        m="10px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        textAlign="center">
        <ChatIcon color="#abb2bf" />
        <Text fontSize="4xl" fontFamily="Fira Sans" fontWeight="bold" color="#abb2bf">PropChat</Text>
      </Box>
      <Box bg="#282c34" w="100%" p={4} borderRadius="lg" color="#abb2bf" fontWeight="bold" borderWidth="0.5px">
        <Tabs variant='soft-rounded'>
          <TabList mb="2px">
            <Tab width="50%">Sign In</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Signin />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home