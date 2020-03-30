import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 200px;
`;

const Button = styled.button`
`;

const Popup = () => (
  <Container>
    <h1>This is the popup</h1>
    <Button>Start</Button>
  </Container>
);

export default Popup;
