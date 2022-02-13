import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import swal from 'sweetalert';
import { pointColor } from '../../../../styles/variables';

const StartButtonDiv = styled.div`
  position: absolute;
  top: 90vh;
  left: 51vw;
  background-color: #f5f5f5;
  border-radius: 1vw;
  padding: 10px;
`;
const EndButtonDiv = styled.div`
  position: absolute;
  top: 90vh;
  left: 60vw;
  background-color: #f5f5f5;
  border-radius: 1vw;
  padding: 10px;
`;

function cho_hangul(str) {
  const cho = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];
  let result = '';
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i) - 44032;
    if (code > -1 && code < 11172) {
      result += cho[Math.floor(code / 588)];
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

export default function GameButton() {
  const { chosonantQuiz, storeSession } = useSelector(
    state => state.MeetingRoom
  );
  const { me } = useSelector(state => state.mypage);

  const onStartButton = () => {
    swal(
      '🔔초성게임🔔',
      '팬들에게 제출할 문제를 입력해주세요! 문제는 초성으로 자동 변경되어 제출됩니다.',
      {
        closeOnClickOutside: false,
        content: 'input',
        button: '제출',
      }
    ).then(answer => {
      const problem = cho_hangul(answer);
      storeSession.signal({
        data: `${me.nick},${problem},${answer}`, // 정답 신호 보내주기
        type: 'Cho',
      });
      swal(
        '문제가 출제되었습니다.',
        '선착순으로 정답을 맞춘 3명의 정보가 나타납니다.',
        'success'
      );
    });
  };

  const onEndButton = e => {
    storeSession.signal({
      data: '', // 정답 신호 보내주기
      type: 'endCho',
    });
  }; // 종료 클릭 시 대기화면으로 넘어가게 처리하기!

  return (
    <>
      <StartButtonDiv>
        <button style={{ fontSize: '1.4vw' }} onClick={onStartButton}>
          게임시작
        </button>
      </StartButtonDiv>
      <EndButtonDiv>
        <button style={{ fontSize: '1.4vw' }} onClick={onEndButton}>
          게임종료
        </button>
      </EndButtonDiv>
    </>
  );
}
