import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Signin = () => {
    const [show, setShow] = useState(false)
    const [Email, setEmail] = useState()
    const [Password, setPassword] = useState()

    const handleClick = () => setShow(!show)
    const submitHandler = () => { }
    return (
        <VStack spacing="5px" color="black">
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='user@example.com' borderColor="blue.300" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} borderColor="blue.300" onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick} textColor="blue.300">
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button width="100%" colorScheme="linkedin" style={{ marginTop: 20 }} onClick={submitHandler}>
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