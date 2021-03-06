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
const SIGNAL_OX = 'SIGNAL_OX';
const OX_GAME_COUNT = 'OX_GAME_COUNT';
const OX_INCORRECT_COUNT = 'OX_INCORRECT_COUNT';
const OX_RESET_COUNT = 'OX_RESET_COUNT';
const OX_RESET_DONE = 'OX_RESET_DONE';
const OX_DONE_CNT = 'OX_DONE_CNT';
const BACKGROUND_COLOR_CHANGE = 'BACKGROUND_COLOR_CHANGE';
const BG_TOGGLE_CHANGE = 'BG_TOGGLE_CHANGE';
const NOW_EMOZI = 'NOW_EMOZI';
const MEETINGROOM_USER_DELETE = 'MEETINGROOM_USER_DELETE';
const PLUS_INDEX = 'PLUS_INDEX';
const RESET_IDNEX = 'RESET_IDNEX';
const CHECK_OUT = 'CHECK_OUT';
const CHOSONANT_QUIZ = 'CHOSONANT_QUIZ';
const PUBLISHER_AUDIO_CHANGE = 'PUBLISHER_AUDIO_CHANGE';
const UPDATE_ONEBYONESTREAM = 'UPDATE_ONEBYONESTREAM';
const ADD_RANDOM_RESULT = 'ADD_RANDOM_RESULT';
const ADD_RANDOM_SUBSCRIBERS = 'ADD_RANDOM_SUBSCRIBERS';
const SET_IS_ONEBYONE = 'SET_IS_ONEBYONE';
const SET_ONEBYONE_TIME = 'SET_ONEBYONE_TIME';
const SET_MY_ANSWER = 'SET_MY_ANSWER';
const SET_YOUR_ANSWER = 'SET_YOUR_ANSWER';

export const randomResult = result => {
  return {
    type: ADD_RANDOM_RESULT,
    payload: result,
  };
};
export const randomSub = sub => {
  return {
    type: ADD_RANDOM_SUBSCRIBERS,
    payload: sub,
  };
};

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

// 영원 추가 ================================
export const UserDelete = subscribers => {
  return {
    type: MEETINGROOM_USER_DELETE,
    payload: subscribers,
  };
};

export const PlusIndex = () => {
  return {
    type: PLUS_INDEX,
  };
};

export const ResetIndex = () => {
  return {
    type: RESET_IDNEX,
  };
};

export const CheckOut = () => {
  return {
    type: CHECK_OUT,
  };
};

export const UpdateOneByOneStream = stream => {
  return {
    type: UPDATE_ONEBYONESTREAM,
    payload: stream,
  };
};

export const SetIsOneByOne = some => {
  return {
    type: SET_IS_ONEBYONE,
    payload: some,
  };
};

export const SetOneByOneMeetingTime = time => {
  return {
    type: SET_ONEBYONE_TIME,
    payload: time,
  };
};

export const SetMyAnswer = answer => {
  return {
    type: SET_MY_ANSWER,
    payload: answer,
  };
};

export const SetYourAnswer = answer => {
  return {
    type: SET_YOUR_ANSWER,
    payload: answer,
  };
};
// 여기까지 =================================

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

export const changeQnAtoggle = toggle => {
  return {
    type: QNA_TOGGLE_CHANGE,
    payload: toggle,
  };
};

// 추가
export const changeBackgroundColor = color => {
  return {
    type: BACKGROUND_COLOR_CHANGE,
    payload: color,
  };
};

export const changeBgToggle = num => {
  console.log(num);
  return {
    type: BG_TOGGLE_CHANGE,
    payload: num,
  };
};

export const changeNowEmozi = num => {
  return {
    type: NOW_EMOZI,
    payload: num,
  };
};

export const signalOX = signal => {
  return {
    type: SIGNAL_OX,
    payload: signal,
  };
};

export const oxGameRound = () => {
  return {
    type: OX_GAME_COUNT,
  };
};

export const oxIncorrectCnt = () => {
  return {
    type: OX_INCORRECT_COUNT,
  };
};

export const resetCnt = () => {
  return {
    type: OX_RESET_COUNT,
  };
};

export const oxDoneCnt = () => {
  return {
    type: OX_DONE_CNT,
  };
};

export const oxResetDone = () => {
  return {
    type: OX_RESET_DONE,
  };
};

export const choQuiz = (question, answer) => {
  return {
    type: CHOSONANT_QUIZ,
    payload: [question, answer],
  };
};

export const audioChange = fe => {
  return {
    type: PUBLISHER_AUDIO_CHANGE,
    payload: fe,
  };
};

const SET_SIGN_BUTTON = 'SET_SIGN_BUTTON';
export const setSignButton = state => ({
  type: SET_SIGN_BUTTON,
  payload: state,
});

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
  // 세션정보
  storeSession: undefined,
  emoziList: [],
  StarQnAtoggle: false,
  OXsignal: null,
  OXgameCount: 1,
  OXincorrectCnt: 0,
  OXdoneCnt: 0,
  myAnswer: null,
  yourAnswer: null,
  index: -1,
  checkCnt: -1,
  backgroundColor: '#C4C4C4', // 배경 컬러
  bgToggle: '0', // 우주배경 or 컬러배경
  nowEmozi: -1,
  chosonantQuiz: [],
  onebyoneStream: undefined,
  signButton: false,
  randomPerson: null,
  randomSubscribers: null,
  isOneByOne: false,
  oneByOneMeetingTime: 60,
};

const MeetingRoom = (state = initialState, action) => {
  switch (action.type) {
    case ADD_RANDOM_RESULT:
      return {
        ...state,
        randomPerson: action.payload,
      };
    case ADD_RANDOM_SUBSCRIBERS:
      return {
        ...state,
        randomSubscribers: action.payload,
      };
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
    // 영원 추가 ============================
    case MEETINGROOM_USER_DELETE:
      return {
        ...state,
        subscribers: action.payload,
      };
    case PLUS_INDEX:
      return {
        ...state,
        index: state.index + 1,
      };
    case RESET_IDNEX:
      return {
        ...state,
        index: -1,
      };
    case CHECK_OUT:
      return {
        ...state,
        checkCnt: state.checkCnt + 1,
      };
    case UPDATE_ONEBYONESTREAM:
      return {
        ...state,
        onebyoneStream: action.payload,
      };
    case SET_IS_ONEBYONE:
      return {
        ...state,
        isOneByOne: action.payload,
      };
    case SET_ONEBYONE_TIME:
      return {
        ...state,
        oneByOneMeetingTime: action.payload,
      };
    case SET_MY_ANSWER:
      return {
        ...state,
        myAnswer: action.payload,
      };
    case SET_YOUR_ANSWER:
      return {
        ...state,
        yourAnswer: action.payload,
      };
    // 여기까지 ============================
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
    case BACKGROUND_COLOR_CHANGE:
      return {
        ...state,
        backgroundColor: action.payload,
      };
    case BG_TOGGLE_CHANGE:
      console.log('asdasdasds');
      return { ...state, bgToggle: action.payload };
    case NOW_EMOZI:
      return { ...state, nowEmozi: action.payload };
    case OX_GAME_COUNT:
      const prevCount = state.OXgameCount;
      return {
        ...state,
        OXgameCount: prevCount + 1,
      };
    case OX_INCORRECT_COUNT:
      return {
        ...state,
        OXincorrectCnt: state.OXincorrectCnt + 1,
      };
    case OX_RESET_COUNT:
      return {
        ...state,
        OXincorrectCnt: 0,
      };
    case OX_DONE_CNT:
      return {
        ...state,
        OXdoneCnt: state.OXdoneCnt + 1,
      };
    case OX_RESET_DONE:
      return {
        ...state,
        OXdoneCnt: 0,
      };
    case CHOSONANT_QUIZ:
      return {
        ...state,
        chosonantQuiz: action.payload,
      };
    // case PUBLISHER_AUDIO_CHANGE:
    //   console.log(
    //     state.publisher.properties.publishAudio,
    //     '리듀서에서의 퍼블리셔'
    //   );
    //   const audiostate = state.publisher.properties.publishAudio;
    //   return {
    //     ...state,
    //   };

    case SET_SIGN_BUTTON:
      return {
        ...state,
        signButton: action.payload,
      };
      break;
    default:
      return state; // 기본 값 반환!
  }
};

export default MeetingRoom; // 외부에서도 사용할 수 있게 export 해준다
