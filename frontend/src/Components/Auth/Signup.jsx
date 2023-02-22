import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const Signup = () => {
    const [show, setShow] = useState(false)
    const [Name, setName] = useState()
    const [Email, setEmail] = useState()
    const [Password, setPassword] = useState()
    const [ConfirmPass, setConfirmPass] = useState()
    const [Pic, setPic] = useState()

    const [loading, setloading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const handleClick = () => setShow(!show)
    const postDetails = (pic) => {
        setloading(true)
        if (pic === undefined) {
            toast({
                title: "Image Not Set!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            })
            setloading(false)
            return
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData()
            data.append("file", pic)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "dhozgj4ra")
            fetch("https://api.cloudinary.com/v1_1/dhozgj4ra", {
                method: "post",
                body: data
            }).then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString())
                    setloading(false)
                })
                .catch((err) => {
                    console.error(err)
                    setloading(false)
                })
        } else {
            toast({
                title: "Select Image Files Only!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            })
            setloading(false)
            return
        }
    }
    const submitHandler = async () => {
        setloading(true)
        if (!Email || !Password || !Name || !ConfirmPass) {
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

        if (Password !== ConfirmPass) {
            toast({
                title: "Passwords Don't Match!",
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
            const { data } = axios.post("/api/user", { Name, Email, Password, Pic }, config)
            toast({
                title: "Successfully Registered!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            })
           // localStorage.setItem("userInfo", JSON.stringify(data))
            setloading(false)

           // navigate("/chats")
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
            <FormControl id='user-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Username' borderColor="blue.300" onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='user@example.com' type="email" pattern=".+@[a-z]+\.com" borderColor="blue.300" onChange={(e) => setEmail(e.target.value)} />
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
            <FormControl id='cnf-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} borderColor="blue.300" onChange={(e) => setConfirmPass(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick} textColor="blue.300">
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload Your Profile Photo</FormLabel>
                <Input type="file" borderColor="blue.300" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>
            <Button width="100%" colorScheme="linkedin" style={{ marginTop: 20 }} onClick={submitHandler} isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup