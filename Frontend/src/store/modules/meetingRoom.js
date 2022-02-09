const CHANGE_QNA_MODE = 'CHANGE_QNA_MODE';
const CHATTING_LIST_PLUS = 'CHATTING_LIST_PLUS';
const MEETINGROOM_USER_UPDATE = 'MEETINGROOM_USER_UPDATE';
const PUBLISHER_INFO = 'PUBLISHER_INFO';
const USER_INFO = 'USER_INFO';
const UPDATE_MAINSTREMMANAGER = 'UPDATE_MAINSTREMMANAGER';
const SCREEN_CHANGE = 'SCREEN_CHANGE';
const USER_NICKNAME = 'USER_NICKNAME';
const CHATTING_INPUT_CHANGE = 'CHATTING_INPUT_CHANGE';
const ADD_QNA_LIST = 'ADD_QNA_LIST';
const MY_SESSION_DEFIND = 'MY_SESSION_DEFIND';
const EMOZI_LIST_ADD = 'EMOZI_LIST_ADD';
const QNA_TOGGLE_CHANGE = 'QNA_TOGGLE_CHANGE';

// QnA 모드를 변경하기위한 action
// 스타가 의 조작에 대한 action이라고 이해하면 된다.
// 0일 경우 qna start
// 1일 경우 qna 종료
// 2일 경우 qna 리스트 불러오기에 관한 조작이다.
export const changeQnAMode = qnaAction => {
  return {
    type: CHANGE_QNA_MODE,
    payload: qnaAction,
  };
};

export const ChattingAction = inputValue => {
  return {
    type: CHATTING_LIST_PLUS,
    payload: inputValue,
  };
};

// 미팅룸에서 새로 들어온 subscriber를 업데이트하는 action
export const UserUpdate = subscriber => {
  return {
    type: MEETINGROOM_USER_UPDATE,
    payload: subscriber,
  };
};

//내 정보에 대해서 업데이트 한다.
// 미팅룸 컴포넌트에서 토큰을 통해 얻은 publisher 정보를 받고,
// 이를 store에 저장시키기 위한 action
export const UpdateMyInformation = publisher => {
  return {
    type: PUBLISHER_INFO,
    payload: publisher,
  };
};

export const GetUserInfo = () => {
  return {
    type: USER_INFO,
  };
};

export const MainStreamManagerInfo = mainStreamManager => {
  return {
    type: UPDATE_MAINSTREMMANAGER,
    payload: mainStreamManager,
  };
};

// 화면 변경시키기 변경시키기
export const ScreenChange = selectNum => {
  return {
    type: SCREEN_CHANGE,
    payload: selectNum,
  };
};

// 변경시킬게 아니라서 생각해보니 필요가없나?  없네 ㅋㅋ''
export const GetNikcName = () => {
  return {
    type: USER_NICKNAME,
  };
};

export const ChattingInputChange = inputText => {
  return {
    type: CHATTING_INPUT_CHANGE,
    payload: inputText,
  };
};

export const AddQnaList = text => {
  return {
    type: ADD_QNA_LIST,
    payload: text,
  };
};

export const SetMySession = session => {
  return {
    type: MY_SESSION_DEFIND,
    payload: session,
  };
};

export const emoziListAdd = emozi => {
  return {
    type: EMOZI_LIST_ADD,
    payload: emozi,
  };
};

export const changeQnAtoggle = tf => {
  return {
    type: QNA_TOGGLE_CHANGE,
    payload: tf,
  };
};

// 평소 컴포넌트에서 선언하던 state들!
const initialState = {
  // 초기에는 시작 안한 상태!
  QnAmode: 'ready',
  QnAList: [],
  chattingList: [],
  subscribers: [],
  publisher: undefined,
  mainStreamManager: undefined,
  selectNum: 0,
  // 임시로 사용하는 유저아이디
  userId: 0,
  // 임시로 사용하는 유저 닉네임
  testInput: '테스트용',
  // 세션정보
  storeSession: undefined,
  emoziList: [],
  StarQnAtoggle: false,
};

const MeetingRoom = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_QNA_MODE:
      return {
        ...state,
        QnAmode: action.payload,
      };
    case CHATTING_LIST_PLUS:
      return {
        ...state,
        chattingList: [...state.chattingList, action.payload],
      };
    case MEETINGROOM_USER_UPDATE:
      return {
        ...state,
        subscribers: [...state.subscribers, action.payload],
      };
    case PUBLISHER_INFO:
      return {
        ...state,
        publisher: action.payload,
      };
    case USER_INFO:
      return {
        ...state,
      };
    case UPDATE_MAINSTREMMANAGER:
      return {
        ...state,
        mainStreamManager: action.payload,
      };
    case SCREEN_CHANGE:
      return {
        ...state,
        selectNum: action.payload,
      };
    case CHATTING_INPUT_CHANGE:
      return {
        ...state,
        testInput: action.payload,
      };
    case ADD_QNA_LIST:
      return {
        ...state,
        QnAList: [...state.QnAList, action.payload],
      };
    case MY_SESSION_DEFIND:
      return {
        ...state,
        storeSession: action.payload,
      };
    case EMOZI_LIST_ADD:
      return {
        ...state,
        emoziList: [...state.emoziList, action.payload],
      };
    case QNA_TOGGLE_CHANGE:
      return {
        ...state,
        StarQnAtoggle: !action.payload,
      };
    default:
      return state; // 기본 값 반환!
  }
};

export default MeetingRoom; // 외부에서도 사용할 수 있게 export 해준다