import styled from 'styled-components';

export const Block = styled.div`
  background-color: #292e34;
  padding: 16px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 8px;
`;

export const SquareGraphBlock = styled(Block)`
  width: 300px;
  height: 300px;
  margin: 16px;
  position: relative;
`;

export const RectGraphBlock = styled(Block)`
  width: 900px;
  height: 460px;
  margin: 16px;
  position: relative;
`;

export const SmallBlock = styled.div`
  padding: 8px;
  margin: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;

export const Title = styled.span`
  position: absolute;
  font-size: 20px;
  top: -13px;
  font-weight: bold;
`;

export const Scroller = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(79, 118, 165);
  }

  &::-webkit-scrollbar-track {
    background: #292e34;
  }
`;
