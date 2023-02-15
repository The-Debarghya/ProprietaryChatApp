import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Signup = () => {
    const [show, setShow] = useState(false)
    const [Name, setName] = useState()
    const [Email, setEmail] = useState()
    const [Password, setPassword] = useState()
    const [ConfirmPass, setConfirmPass] = useState()
    const [Pic, setPic] = useState()
    const handleClick = () => setShow(!show)
    const postDetails = () => {}
    const submitHandler = () => {}

    return (
        <VStack spacing="5px" color="black">
            <FormControl id='user-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Username' borderColor="blue.300" onChange={(e) => setName(e.target.value) } />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='user@example.com' borderColor="blue.300" onChange={(e) => setEmail(e.target.value) } />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show?"text":"password"} borderColor="blue.300" onChange={(e) => setPassword(e.target.value) } />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick} textColor="blue.300">
                            {show ? "Hide":"Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='cnf-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show?"text":"password"} borderColor="blue.300" onChange={(e) => setConfirmPass(e.target.value) } />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick} textColor="blue.300">
                            {show ? "Hide":"Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload Your Profile Photo</FormLabel>
                <Input type="file" borderColor="blue.300" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>
            <Button width="100%" colorScheme="linkedin" style={{marginTop: 20}} onClick={submitHandler}>
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup