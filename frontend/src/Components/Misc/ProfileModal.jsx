import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div>
            {children ? (<span onClick={onOpen}>{children}</span>) : (<IconButton display={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon />} />)}
            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h="400px">
                    <ModalHeader fontSize="40px" fontFamily="Fira sans" display="flex" justifyContent="center">
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
                        <Image src={user.pic} alt={user.name} borderRadius="full" boxSize="150px" />
                        <Text fontSize={{base: "28px", md: "30px"}} fontFamily="Fira sans">
                            Email: {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="whatsapp" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileModal