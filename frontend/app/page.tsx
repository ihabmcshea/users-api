import { Flex } from '@chakra-ui/react';
import MainPage from './components/main';

export default function Home() {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} p={4}>
      <MainPage />
    </Flex>
  );
}
