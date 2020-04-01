import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const Z_INDEX = 5000;

export const SelectionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-style: solid;
  background-color: inherit;
  border-color: rgba(0, 0, 0, 0.5);
  z-index: ${Z_INDEX};
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${Z_INDEX};
`;

export const Crosshairs = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;

  &::before, &::after {
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    border: none !important;
    border-image:  !important;
  }

  &::before {
    left: -100%;
    top: -100%;
    border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
  }

  &::after {
    left: -1px;
    top: -1px;
    border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-left: 1px solid rgba(255, 255, 255, 0.3) !important;
  }
`;

export const Instructions = styled(Typography)`
  && {
    position: fixed;
    top: 24px;
    left: 0;
    right: 0;
    text-align: center;
    color: white;
  }
`;
