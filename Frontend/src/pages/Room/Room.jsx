import styled from 'styled-components';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import './SwalCss.css';

// action 호출
import {
  ChattingAction,
  UserUpdate,
  UpdateMyInformation,
  MainStreamManagerInfo,
  ScreenChange,
  ChattingInputChange,
  changeQnAMode,
  SetMySession,
  emoziListAdd,
  AddQnaList,
  UserDelete,
  choQuiz,
  audioChange,
  UpdateOneByOneStream,
  SetIsOneByOne,
  SetOneByOneMeetingTime,
  oxDoneCnt,
  oxIncorrectCnt,
} from '../../store/modules/meetingRoom';
import { WarningToMemberAPI } from '../../store/apis/Main/meeting';
import { AddGameScoreAPI, CallGameRankAPI } from '../../store/apis/Room/game';
// 컴포넌트
import RoomComponent from './RoomComponent';
import { BASE_URL } from '../../utils/contants';
// import { BackgroundDiv } from '../../../components/room/styles/roomGlobal';

const OPENVIDU_SERVER_URL = 'https://i6e204.p.ssafy.io:8443';
const OPENVIDU_SERVER_SECRET = 'YOURSTAR';

const List = [
  '대기화면',
  '공연모드',
  'QnA모드',
  '랜덤추첨',
  'O/X게임',
  '초성게임',
  '1:1팬미팅',
];

class Room extends Component {
  constructor(props) {
    super(props);
    var pathname = props.location.pathname;

    this.state = {
      mySessionId: pathname.substr(6), // 넘어온 미팅룸 ID 입력
      session: undefined,
      me: this.props.me, // Store에 저장된 내 정보 입력
      recordId: null,
      choAnsUserCnt: 1, // 초성게임 맞춘 유저 수
    };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
    this.joinSession();
    console.log('내 정보 확인', this.state.me);
  }

  componentDidUpdate(prevState) {
    if (prevState.selectNum !== this.props.selectNum) {
      if (this.props.selectNum === 6) {
        if (this.state.me.code !== 3) {
          this.starJoinOnebyOne();
        }
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  onbeforeunload(event) {
    // this.leaveSession();
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.props.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.props.doDeleteSubscriber(subscribers);
    }
  }

  joinSession() {
    console.log('====== JOINSESSION ======');
    this.OV = new OpenVidu(); // Openvidu 객체 생성

    // 세션 진입
    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;
        // 현재 미팅룸에 들어온 사용자 확인
        mySession.on('streamCreated', event => {
          var subscriber = mySession.subscribe(event.stream, undefined); // 들어온 사용자의 정보
          var subInfo = JSON.parse(subscriber.stream.connection.data);
          if (subInfo.memberInfo !== undefined) {
            console.log('===== 불러오기 성공 ======');
            this.props.doUpdateOneByOne(subscriber);
          } else {
            // 스타가 들어왔으면 메인 화면으로, 아니면 일반 화면으로 보냄
            if (subInfo.memberCode === 4) {
              this.props.doMainStreamManagerInfo(subscriber);
            } else if (subInfo.memberCode === 3) {
              console.log('=====사용자 입장=====');
              this.props.doUserUpdate(subscriber);
            }
          }
        });

        // 현재 미팅룸에서 퇴장한 사용자 확인
        mySession.on('streamDestroyed', event => {
          var check = mySession.sessionId.slice(-1);
          if (check !== 'e') {
            console.log('===== 누군가 퇴장 =====');
            this.deleteSubscriber(event.stream.streamManager);
          }
        });

        // Exception 처리
        mySession.on('exception', exception => {
          console.warn(exception);
        });

        // 현재 미팅룸 채팅 데이터 받는 부분
        mySession.on('signal:chat', event => {
          let chatdata = event.data.split(',');
          if (chatdata[0] !== this.props.me.nick) {
            const inputValue = {
              userName: chatdata[0],
              text: chatdata[1],
              chatClass: 'messages__item--operator',
            };
            this.props.doChattingAction(inputValue);
          }
        });

        //변화감지
        mySession.on('signal:screen', event => {
          // event.data ==> string 형태의 변화된 메뉴선택한 번호들!
          // 일반 유저가 변화를 감지하는 부분          let changeNum = parseInt(event.data);
          let changeNum = parseInt(event.data);
          if (changeNum !== this.props.selectNum) {
            if (changeNum === 6 && this.state.me.code === 4) {
            } else {
              swal({
                title: '컨텐츠 이동 알림',
                text: List[changeNum] + ' 컨텐츠로 이동',
                icon: 'info',
                buttons: false,
                timer: 2000,
              });
            }
            if (changeNum !== 6) {
              this.props.doScreenChange(changeNum);
              this.props.publisher.publishVideo(true);
              this.props.doSetIsOneByOne(false);
            } else {
              this.props.doSetIsOneByOne(true);
            }
          }
        });

        mySession.on('signal:emozi', event => {
          let emozidata = event.data.split(',');
          if (emozidata[0] !== this.props.me.nick) {
            this.props.doemoziListAdd(emozidata[1]);
          }
        });
        mySession.on('signal:one', event => {
          // 일반 유저가 1대1 미팅 참여 요구받음
          let data = event.data.split(',');
          let changeNum = parseInt(data[0]);
          if (changeNum !== this.props.selectNum) {
            this.props.doSetOneByOneMeetingTime(data[1]);
            this.props.doScreenChange(changeNum);
            this.userJoinOnebyOne();
          }
        });

        mySession.on('signal:oneback', event => {
          // 일반 유저가 1대1 미팅 퇴장 요구 받음
          let changeNum = parseInt(event.data);
          if (changeNum !== this.props.selectNum) {
            if (this.state.me.code === 3) {
              this.props.doScreenChange(changeNum);
              mySession.disconnect();
              this.joinSession();
              this.stopRecording();
            }
          }
        });

        mySession.on('signal:starback', event => {
          // 스타가 1대1 미팅 퇴장 요구 받음
          let changeNum = parseInt(event.data);
          if (changeNum !== this.props.selectNum) {
            if (this.state.me.code === 4) {
              this.props.doScreenChange(changeNum);
              mySession.disconnect();
              var empty = [];
              this.props.doDeleteSubscriber(empty);
              this.joinSession();
            }
          }
        });

        // 대기 순번 알리기
        mySession.on('signal:userwait', event => {
          let sec = parseInt(event.data);
          let min = parseInt(sec / 60);
          sec = sec % 60;

          if (min === 0) {
            swal({
              title: '1대1미팅 대기시간 알림',
              text: '약 ' + sec + '초 뒤 입장 됩니다.',
              timer: 5000,
            });
          } else {
            swal({
              title: '1대1미팅 대기시간 알림',
              text: '약 ' + min + '분 ' + sec + '초 뒤 입장 됩니다.',
              timer: 5000,
            });
          }
        });

        if (this.props.userCode === 3) {
          mySession.on('signal:Cho', event => {
            let chodata = event.data.split(',');
            if (chodata[0] !== this.props.chosonantQuiz) {
              this.props.dochosonantQuiz(chodata[1], chodata[2]);
            }
          });
        }

        // ox 게임
        if (this.props.userCode === 4) {
          // OX 게임 인식 완료 신호 수신
          mySession.on('signal:OXDone', event => {
            this.props.doOXDoneCnt();
          });

          mySession.on('signal:OXIncorrect', event => {
            this.props.doOXIncorrectCnt();
          });
        }

        if (this.props.userCode === 4) {
          // 스타일 때
          mySession.on('signal:ChoUserAns', event => {
            if (this.state.choAnsUserCnt < 4) {
              // 맞춘 유저 수가 3명보다 적다면
              // 세션 받와와서 처리해주기
              let chodata = event.data.split(',');
              swal(
                `🎇${this.state.choAnsUserCnt}등 정답자 : ${chodata[0]}🎇`,
                '축하합니다',
                { timer: 1800, button: false }
              );
              // DB에 넣어주기 chodata[1] -> memberId
              AddGameScoreAPI(mySession.sessionId, chodata[1]);
              this.setState({ choAnsUserCnt: this.state.choAnsUserCnt + 1 }); // 맞춘 사람 수 1 늘리기
            }
            if (this.state.choAnsUserCnt === 4) {
              // 마지막 정답자라면
              // 게임 reset or 다시 하기
              this.setState({ choAnsUserCnt: 1 }); // 맞춘 사람 수 초기화
              setTimeout(function () {
                swal('🎇3명의 정답자가 나왔습니다.🎇', '게임이 초기화됩니다.', {
                  button: false,
                  timer: 2000,
                }).then(() => {
                  mySession.signal({
                    // 초기화 신호 보내기
                    data: '5',
                    to: [],
                    type: 'endConsonant',
                  });
                });
              }, 2000);
            }
          });
        }

        // 초성게임 초기화
        mySession.on('signal:endConsonant', () => {
          this.props.doScreenChange(5);
          this.props.publisher.publishVideo(true);
          swal('🎇3명의 정답자가 나왔습니다!!🎇', '다음 라운드로 넘어갑니다', {
            timer: 2000,
            button: false,
          });
        });

        // 초성게임 종료
        mySession.on('signal:endCho', () => {
          let data = [];
          const result = axios // 1. 점수 집계 중입니다 먼저 띄워주기 (API 받아오기) 1초
            .get(`${BASE_URL}meetings/game-result/admin/${mySession.sessionId}`)
            .then(function (response) {
              data = response.data;
            });
          swal({
            title: '점수 집계중',
            icon: 'https://www.gjstec.or.kr/img/loading.gif',
            text: '잠시만 기다려 주세요',
            timer: 3000,
            button: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
          }).then(() => {
            console.log('1////////////', data.content);
            swal(
              '현재까지 게임 순위 결과 \n 축하합니다!🎉',
              `🥇: ${data.content[0][0]} : ${data.content[0][1]}점\n 🥈: ${data.content[1][0]} : ${data.content[1][1]}점\n 🥉: ${data.content[2][0]} : ${data.content[2][1]}점`,
              {
                // 2. 점수 띄워주기 (최종 등수 알려주기) 3초
                timer: 3000,
                button: false,
                closeOnClickOutside: false,
                closeOnEsc: false,
              }
            ).then(() => {
              swal({
                // 3. 게임 종료 알려주기 세션으로 돌아가기 (종료) 2초
                title: '초성 게임 세션 종료',
                text: '대기화면으로 이동합니다',
                icon: 'info',
                buttons: false,
                closeOnClickOutside: false,
                closeOnEsc: false,
                timer: 2000,
              }).then(() => {
                mySession.signal({
                  data: '0',
                  to: [],
                  type: 'screen',
                });
                this.props.doScreenChange(0);
              });
            });
          });
        });

        // OX게임 종료
        mySession.on('signal:endOX', () => {
          let data = [];
          const result = axios // 1. 점수 집계 중입니다 먼저 띄워주기 (API 받아오기) 1초
            .get(`${BASE_URL}meetings/game-result/admin/${mySession.sessionId}`)
            .then(function (response) {
              data = response.data;
            });
          //this.props.meetingId
          swal({
            title: '점수 집계중',
            icon: 'https://www.gjstec.or.kr/img/loading.gif',
            text: '잠시만 기다려 주세요',
            timer: 3000,
            button: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
          }).then(() => {
            swal(
              '현재까지 게임 순위 결과 \n 축하합니다!🎉',
              `🥇: ${data.content[0][0]} : ${data.content[0][1]}점\n 🥈: ${data.content[1][0]} : ${data.content[1][1]}점\n 🥉: ${data.content[2][0]} : ${data.content[2][1]}점`,
              {
                // 2. 점수 띄워주기 (최종 등수 알려주기) 3초

                timer: 3000,
                button: false,
                closeOnClickOutside: false,
                closeOnEsc: false,
              }
            ).then(() => {
              swal({
                // 3. 게임 종료 알려주기 세션으로 돌아가기 (종료) 2초
                title: 'OX게임 세션 종료',
                text: '대기화면으로 이동합니다',
                icon: 'info',
                buttons: false,
                closeOnClickOutside: false,
                closeOnEsc: false,
                timer: 2000,
              }).then(() => {
                mySession.signal({
                  data: '0',
                  to: [],
                  type: 'screen',
                });
                this.props.doScreenChange(0);
              });
            });
          });
          this.props.publisher.publishVideo(true);
        });

        // qna 스티커 받기
        mySession.on('signal:QnAFromUser', event => {
          // console.log('------------------------')
          this.props.doAddQnaList({ text: event.data });
        });

        mySession.on('signal:audio', event => {
          console.log('===== 오디오 상태 변경 =====');
          if (event.data === 'true') {
            this.props.publisher.publishAudio(true);
          } else {
            this.props.publisher.publishAudio(false);
          }
        });

        mySession.on('signal:video', event => {
          console.log('===== 비디오 상태 변경 =====');
          if (event.data === 'true') {
            this.props.publisher.publishVideo(true);
          } else {
            this.props.publisher.publishVideo(false);
          }
        });

        // 경고창
        mySession.on('signal:warning', event => {
          if (parseInt(event.data) === 1) {
            swal({
              icon: 'https://cdn-icons-png.flaticon.com/512/2761/2761896.png',
              title: '🚨 경고 🚨',
              text: '부적절한 행위 및 언행으로 경고 1회를 받으셨습니다. \n 경고 2회 누적 시 강퇴 및 재입장이 불가합니다.',
              className: 'swal-warning',
            });
          } else {
            // 강퇴시 이동할 경로
            const url =
              window.location.protocol +
              '//' +
              window.location.host +
              `/schedule/${this.state.mySessionId}`;
            swal({
              icon: 'https://cdn-icons-png.flaticon.com/512/2761/2761817.png',
              title: '🚨 경고 🚨',
              text: '부적절한 행위 및 언행으로 경고 2회를 받으셨습니다. \n 확인 클릭 또는 10초 뒤 팬미팅에서 자동으로 나가게 되며, 재입장이 불가합니다.',
              className: 'swal-warning',
              button: '확인',
            }).then(() => {
              window.location.replace(url);
            });
            setTimeout(() => window.location.replace(url), 10000);
          }
        });

        // 사인 알림
        mySession.on('signal:signon', event => {
          if (this.state.me.code !== 4) {
            swal({
              title: '사인 알림',
              text: '스타가 사인을 진행하고 있습니다',
              buttons: false,
              timer: 1500,
              icon: 'info',
            });
          }
        });

        mySession.on('signal:signoff', event => {
          if (this.state.me.code !== 4) {
            swal({
              title: '사인 알림',
              text: '스타가 사인을 마쳤습니다',
              buttons: false,
              timer: 1500,
              icon: 'info',
            });
          }
        });

        // 종료 알림
        mySession.on('signal:end', event => {
          const url =
            window.location.protocol +
            '//' +
            window.location.host +
            `/schedule/${this.state.mySessionId}`;
          mySession.disconnect();
          swal({
            title: '미팅 종료 알림',
            text: '미팅 상세 페이지로 이동됩니다',
            icon: 'info',
            buttons: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
            timer: 1500,
          }).then(() => {
            window.location.replace(url);
          });
        });

        mySession.on('signal:OXEnd', event => {
          console.log('=== 유저가 OX게임 종료 신호 받음 ===');
          let data = event.data.split(',');
          let round = data[0];
          let starAnswer = data[1];

          if (this.props.myAnswer === starAnswer) {
            swal({
              title: round + '라운드 종료',
              text: '정답 50point 적립!',
              icon: 'success',
              buttons: false,
              timer: 1500,
            });
            AddGameScoreAPI(this.state.mySessionId, this.state.me.memberId);
          } else {
            swal({
              title: round + '라운드 종료',
              text: '오답',
              icon: 'error',
              buttons: false,
              timer: 1500,
            }).then(() => {
              this.state.publisher.publishVideo(false);
              const data = {
                session: this.state.mySessionId,
                to: [],
                type: 'signal:OXIncorrect',
                data: '0',
              };
              axios
                .post(OPENVIDU_SERVER_URL + '/openvidu/api/signal', data, {
                  headers: {
                    Authorization:
                      'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                    'Content-Type': 'application/json',
                  },
                })
                .then(response => {
                  console.log(response);
                })
                .catch(error => console.error(error));
            });
          }
        });

        // 세션과 연결하는 부분
        this.getToken(this.state.mySessionId).then(token => {
          mySession
            .connect(token, {
              // 추가로 넘겨주고 싶은 데이터가 있으면 여기에 추가
              clientData: this.state.me.nick,
              memberCode: this.state.me.code,
              memberId: this.state.me.memberId,
            })
            .then(() => {
              // 연결 후에 내 정보를 담기
              let publisher;
              if (this.state.me.code === 3) {
                publisher = this.OV.initPublisher(undefined, {
                  audioSource: undefined, // The source of audio. If undefined default microphone
                  videoSource: undefined, // The source of video. If undefined default webcam
                  publishAudio: false, // Whether you want to start publishing with your audio unmuted or not
                  publishVideo: true, // Whether you want to start publishing with your video enabled or not
                  resolution: '640x480', // The resolution of your video
                  frameRate: 30, // The frame rate of your video
                  insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                  mirror: false, // Whether to mirror your local video or not
                });
              } else {
                publisher = this.OV.initPublisher(undefined, {
                  audioSource: undefined, // The source of audio. If undefined default microphone
                  videoSource: undefined, // The source of video. If undefined default webcam
                  publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                  publishVideo: true, // Whether you want to start publishing with your video enabled or not
                  resolution: '640x480', // The resolution of your video
                  frameRate: 30, // The frame rate of your video
                  insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                  mirror: false, // Whether to mirror your local video or not
                });
              }

              // 세션에 내 비디오 및 마이크 정보 푸시
              mySession.publish(publisher);

              // 스토어로 저장을 해봐라.
              this.props.doSetMySession(mySession);

              // 내 화면 보이게 하기
              if (this.props.me.code === 4)
                this.props.doMainStreamManagerInfo(publisher);
              else this.props.doUpdateMyInformation(publisher); // 내 화면 보기 설정
            })
            .catch(error => {
              console.log(
                'There was an error connecting to the session:',
                error.code,
                error.message
              );
            });
        });
      }
    );
  }

  starJoinOnebyOne() {
    const mySession = this.state.session;
    mySession.disconnect();

    // 1대1 미팅룸으로 입장
    var onebyoneSessionId = this.state.mySessionId + '-onebyone';
    console.log('1대1 세션 입장 ', onebyoneSessionId);
    this.getToken(onebyoneSessionId).then(token => {
      mySession
        .connect(token, {
          // 추가로 넘겨주고 싶은 데이터가 있으면 여기에 추가
          clientData: this.state.me.nick,
          memberCode: this.state.me.code,
        })
        .then(() => {
          // 연결 후에 내 정보를 담기
          let publisher = this.OV.initPublisher(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // 세션에 내 비디오 및 마이크 정보 푸시
          mySession.publish(publisher);
          this.props.doSetMySession(mySession);
          this.props.doMainStreamManagerInfo(publisher);
        })
        .catch(error => {
          console.log(
            'There was an error connecting to the session:',
            error.code,
            error.message
          );
        });
    });
  }

  userJoinOnebyOne() {
    const mySession = this.state.session;
    mySession.disconnect();

    // 세션과 연결을 끊고 Store에 다른 사람들의 비디오도 초기화 해줌
    var empty = [];
    this.props.doDeleteSubscriber(empty);

    // 1대1 미팅룸으로 입장
    var onebyoneSessionId = this.state.mySessionId + '-onebyone';
    console.log('1대1 세션 입장 ', onebyoneSessionId);
    this.createToken(onebyoneSessionId).then(token => {
      mySession
        .connect(token, {
          // 추가로 넘겨주고 싶은 데이터가 있으면 여기에 추가
          clientData: this.state.me.nick,
          memberCode: this.state.me.code,
          memberId: this.state.me.memberId,
          memberInfo: 'one',
        })
        .then(() => {
          // 연결 후에 내 정보를 담기
          let publisher = this.OV.initPublisher(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // 세션에 내 비디오 및 마이크 정보 푸시
          mySession.publish(publisher);
          this.props.doSetMySession(mySession);
          this.props.doUpdateMyInformation(publisher);
        })
        .catch(error => {
          console.log(
            'There was an error connecting to the session:',
            error.code,
            error.message
          );
        });
    });

    // 녹화 시작
    var data = {
      session: onebyoneSessionId,
      name:
        'room-' + mySession.sessionId + '_memberId-' + this.state.me.memberId,
      hasAudio: true,
      hasVideo: true,
      outputMode: 'COMPOSED',
      resolution: '1280x720',
      frameRate: 25,
      shmSize: 536870912,
      ignoreFailedStreams: false,
    };
    axios
      .post(OPENVIDU_SERVER_URL + '/openvidu/api/recordings/start', data, {
        headers: {
          Authorization:
            'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log('===== 녹화 시작 =====', response);
        this.setState({
          recordId: response.data.id,
        });
      })
      .catch(error => console.error(error));
  }

  stopRecording() {
    console.log('recordid -------- ', this.state.recordId);
    axios
      .post(BASE_URL + 'meetings/recording', {
        meetingId: this.state.mySessionId,
        memberId: this.state.me.memberId,
        recordId: this.state.recordId,
      })
      .then(response => {
        console.log('===== 녹화 중지 =====', response);
      });
  }

  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
    });
  }

  render() {
    return (
      <div>
        {/* 컴포넌트는 들고왔을 때 잘 작동함 */}
        <div className="container">
          {this.state.session === undefined ? (
            <div>Loading</div>
          ) : (
            <div>
              <RoomComponent></RoomComponent>
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  getToken(curSessionId) {
    console.log('===== 세션 연결 중 : ', curSessionId);
    return this.createSession(curSessionId).then(sessionId =>
      this.createToken(sessionId)
    );
  }

  createSession(curSessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: curSessionId });
      axios
        .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log('CREATE SESION', response);
          resolve(response.data.id);
        })
        .catch(response => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(curSessionId);
          } else {
            console.log(error);
            console.warn(
              'No connection to OpenVidu Server. This may be a certificate error at ' +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + '/accept-certificate'
              );
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      if (this.state.me.code === 4) data.role = 'MODERATOR';
      else if (this.state.me.code === 2) data.role = 'SUBSCRIBER';
      axios
        .post(
          OPENVIDU_SERVER_URL +
            '/openvidu/api/sessions/' +
            sessionId +
            '/connection',
          data,
          {
            headers: {
              Authorization:
                'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
              'Content-Type': 'application/json',
            },
          }
        )
        .then(response => {
          console.log('TOKEN', response);
          resolve(response.data.token);
        })
        .catch(error => reject(error));
    });
  }
}

const mapStateToProps = state => ({
  // 채팅내용
  chattingList: state.MeetingRoom.chattingList,
  // 입장한 유저들 정보
  subscribers: state.MeetingRoom.subscribers,
  publisher: state.MeetingRoom.publisher,
  // 임시용 userid
  userId: state.MeetingRoom.userId,
  mainStreamManager: state.MeetingRoom.mainStreamManager,
  selectNum: state.MeetingRoom.selectNum,
  userNickName: state.MeetingRoom.userNickName,
  testInput: state.MeetingRoom.testInput,
  me: state.mypage.me,
  QnAmode: state.MeetingRoom.QnAmode,
  userCode: state.mypage.me.code,
  chosonantQuiz: state.MeetingRoom.chosonantQuiz,
  meetingId: state.meeting.meeting.id,
  myAnswer: state.MeetingRoom.myAnswer,
});

const mapDispatchToProps = dispatch => {
  return {
    doChattingAction: inputValue => dispatch(ChattingAction(inputValue)),
    doUserUpdate: subscriber => dispatch(UserUpdate(subscriber)),
    doUpdateMyInformation: publisher =>
      dispatch(UpdateMyInformation(publisher)),
    doMainStreamManagerInfo: mainStreamManager =>
      dispatch(MainStreamManagerInfo(mainStreamManager)),
    doScreenChange: selectNum => dispatch(ScreenChange(selectNum)),
    doChattingInputChange: testinput =>
      dispatch(ChattingInputChange(testinput)),
    dochangeQnAMode: QnAmode => dispatch(changeQnAMode(QnAmode)),
    doSetMySession: storeSession => dispatch(SetMySession(storeSession)),
    doemoziListAdd: emozi => dispatch(emoziListAdd(emozi)),
    doAddQnaList: QnAText => dispatch(AddQnaList(QnAText)),
    doDeleteSubscriber: subscribers => dispatch(UserDelete(subscribers)),
    dochosonantQuiz: (problem, answer) => dispatch(choQuiz(problem, answer)),
    doaudioChange: () => dispatch(audioChange()),
    doWarningToMemberAPI: (memberId, meetingId) =>
      WarningToMemberAPI({ memberId, meetingId }),
    doUpdateOneByOne: stream => dispatch(UpdateOneByOneStream(stream)),
    doSetIsOneByOne: some => dispatch(SetIsOneByOne(some)),
    doSetOneByOneMeetingTime: time => dispatch(SetOneByOneMeetingTime(time)),
    doOXDoneCnt: () => dispatch(oxDoneCnt()),
    doOXIncorrectCnt: () => dispatch(oxIncorrectCnt()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
