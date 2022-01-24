import styled from 'styled-components';
import { blockColor, device } from '../../styles/variables';

const AdminWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const AdminBlock = styled.div`
  max-width: 1200px;
  width: 70%;
  height: 78.5vh;
  overflow-y: auto;
  background-color: ${blockColor};
  border-radius: 10px;
  color: black;
  @media ${device.TabletPortrait} {
    width: 100%;
    border-radius: 0px;
  }
`;
const Icon = styled.div`
  size: 3vw;
  padding-top: 10px;
  padding-right: 0.5vw;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
    transition: 0.5s;
  }
`;
const Title = styled.div`
  font-size: 2.2vw;
  color: black;
  height: 10vh;
  /* border: solid red; */
  display: flex; // div태그 내 text 수직, 수평정렬
  align-items: center; // div태그 내 text 수직, 수평정렬
  /* justify-content: center; // div태그 내 text 수직, 수평정렬 */
  div {
    padding-left: 1.2vw;
    text-align: left;
  }
`;
const Image = styled.div`
  width: 100%;
  height: 100%;
  color: black;
  position: relative;
  /* border: solid red; */
  img {
    padding-top: 2.8vh;
    padding-left: 0.5vw;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6%;
  }
`;

const Section1 = styled.div`
  padding-left: 2vw;
  margin: 0 auto;
  height: 34.2vh;
  color: black;
  /* border: solid red; */
  table {
    width: 100%;
    text-align: left;
  }
  td {
    font-size: 1vw;
    font-weight: bold;
    padding-top: 2.8vh;
  }
`;
const Section2 = styled.div`
  height: 34.2vh;
  color: black;
  padding-right: 2vw;
  /* border: solid red; */
  div {
    padding-top: 2.8vh;
    padding-left: 2vw;
    text-align: left;
    font-size: 1vw;
  }
`;

export { AdminBlock, Icon, AdminWrapper, Title, Image, Section1, Section2 };
