import React, { useEffect, useRef } from 'react';
import {
  MiddleChattingBox,
  MiddleChattingInputBox,
  MiddleChattingListBox,
  ThridSideDiv2,
} from './Chatting.style';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChattingInputChange,
  ChattingAction,
} from '../../../../../store/modules/meetingRoom';
import { checkText } from '../../../../../utils/checkText';

export default function MiddleChatting() {
  const [testInput, setTestinput] = React.useState('');

  const dispatch = useDispatch();

  const SubmitText = Input => dispatch(ChattingInputChange(Input));
  const AppendChattingList = inputValue => dispatch(ChattingAction(inputValue));

  const handleChatMessageChange = e => {
    setTestinput(e.target.value);
  };

  const { storeSession, backgroundColor, chattingList } = useSelector(
    state => state.MeetingRoom
  );

  const { me } = useSelector(state => state.mypage);

  const SendMessage = e => {
    if (e.key === 'Enter' && testInput !== '') {
      if (checkText(testInput)) {
        const inputValue = {
          userName: me.nick,
          text: testInput,
          chatClass: 'messages__item--operator',
        };
        storeSession.signal({
          data: `${me.nick},${testInput}`,
          to: [],
          type: 'chat',
        });
        SubmitText(testInput);
        AppendChattingList(inputValue);
      }
      setTestinput('');
    }
  };

  // 채팅 스크롤 아래로 내려주기
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    // 채팅 리스트가 업데이트 될 때마다 제일 아래로 내려주기
    scrollToBottom();
  }, [chattingList]);

  return (
    <>
      <ThridSideDiv2>
        <MiddleChattingBox>
          <MiddleChattingListBox>
            {chattingList.map((value, idx) => {
              return (
                <div key={idx + value.text}>
                  <p style={{ margin: '0' }}>
                    {value.userName} : {value.text}
                  </p>
                </div>
              );
            })}
            <div ref={messagesEndRef}></div> {/**채팅 스크롤 아래로 내려주기 */}
          </MiddleChattingListBox>
          <MiddleChattingInputBox
            onKeyPress={SendMessage}
            value={testInput}
            onChange={handleChatMessageChange}
            color={backgroundColor} // redux에서 받아온 color를 input styled에 넣어주기
          ></MiddleChattingInputBox>
        </MiddleChattingBox>
      </ThridSideDiv2>
    </>
  );
}
