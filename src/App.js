import React from 'react';
import Header from 'components/header';
import { Route, Routes } from 'react-router-dom';
import routes from 'routes';
import { Container, ScrollArea } from '@mantine/core';

const App = () => {
  return (
    <ScrollArea h={'100dvh'}>
      <Container size={'xl'}>
        <Header />
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </Container>
    </ScrollArea>
  );
};

export default App;
