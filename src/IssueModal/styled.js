import styled from 'styled-components';

export const Preview = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 300px;
  max-width: 600px;
  background-image: url('${({ src }) => src}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: gainsboro;
  border-radius: 4px;
`;
