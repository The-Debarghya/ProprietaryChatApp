import { ChatIcon } from '@chakra-ui/icons'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React from 'react'
import Signin from '../Components/Auth/Signin'
import Signup from '../Components/Auth/Signup'

const Home = () => {
  return (
    <Container maxW='xl' centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        textAlign="center">
        <ChatIcon/>
        <Text fontSize="4xl" fontFamily="Fira Sans" fontWeight="bold">PropChat</Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="1g" color="black" fontWeight="bold" borderWidth="1px">
        <Tabs variant='soft-rounded'>
          <TabList mb="1em">
            <Tab width="50%">Sign In</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Signin/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home