'use client';

import React, { useEffect } from 'react';
import {
    Box,
    Flex,
    Button,
    Heading,
    Spinner,
    useColorMode,
    useDisclosure,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Stack,
    useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { user, isLoading } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isMobile = useBreakpointValue({ base: true, md: false });


    useEffect(() => {
        console.log(user);
    }, [user])
    return (
        <Box
            as="header"
            bg={colorMode === 'light' ? 'gray.800' : 'gray.900'}
            color={colorMode === 'light' ? 'white' : 'gray.200'}
            p={4}
            width="100%"
        >
            <Flex align="center" justify="space-between" maxW="1200px" mx="auto" wrap="wrap">
                <Heading as="h1" size="lg">
                    <Link href="/">Users API</Link>
                </Heading>

                {isMobile ? (
                    <>
                        <IconButton
                            aria-label="Open menu"
                            icon={<HamburgerIcon />}
                            onClick={onOpen}
                            variant="outline"
                            colorScheme="teal"
                        />
                        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                            <DrawerOverlay />
                            <DrawerContent>
                                <DrawerCloseButton />
                                <DrawerHeader>Menu</DrawerHeader>
                                <DrawerBody>
                                    {isLoading ? (
                                        <Spinner />
                                    ) : user ? (
                                        <Stack spacing={4}>
                                            <UserMenu isMobile={isMobile} />
                                        </Stack>
                                    ) : (
                                        <LoginModal />
                                    )}
                                </DrawerBody>
                            </DrawerContent>
                        </Drawer>
                    </>
                ) : (
                    <Flex align="center">
                        {isLoading ? (
                            <Spinner />
                        ) : user ? (
                            <>
                                <UserMenu />
                            </>
                        ) : (
                            <LoginModal />
                        )}
                    </Flex>
                )}
            </Flex>
        </Box>
    );
};

export default Header;
