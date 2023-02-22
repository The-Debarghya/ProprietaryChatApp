import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const Signin = () => {
    const [show, setShow] = useState(false)
    const [Email, setEmail] = useState()
    const [Password, setPassword] = useState()

    const [loading, setloading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const handleClick = () => setShow(!show)
    const submitHandler = async () => { 
        setloading(true)
        if (!Email || !Password) {
            toast({
                title: "Please Fill All Fields!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            setloading(false)
            return
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = axios.post("/api/user/login", { Email, Password }, config)
            toast({
                title: "Log In Success!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            setloading(false)

            navigate("/chats")
        } catch (error) {
            toast({
                title: "Unexpected Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            setloading(false)
            return
        }

    }

    return (
        <VStack spacing="5px" color="black">
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='user@example.com' type="email" value={Email} borderColor="blue.300" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} value={Password} borderColor="blue.300" onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick} textColor="blue.300">
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button width="100%" colorScheme="linkedin" style={{ marginTop: 20 }} onClick={submitHandler} isLoading={loading}>
                Sign In
            </Button>
            <Button width="100%" colorScheme="whatsapp" style={{ marginTop: 10 }} onClick={() => { 
                setEmail("guest@randomdomain.com"); 
                setPassword("password");
            }}>
                Use Guest Mode
            </Button>
        </VStack>
    )
}

export default Signin