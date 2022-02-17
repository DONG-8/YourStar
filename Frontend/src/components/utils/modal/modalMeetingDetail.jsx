import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setMeetingDetailState } from '../../../store/modules/mypage';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import {
  MEETING_APPLY_REQUEST,
  MEETING_GAME_RESULT_REQUEST,
} from '../../../store/modules/meetingList';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

export default function BasicModal({ meeting }) {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setMeetingDetailState(false));
  }; // modal창 밖을 클릭했을 때 off
  useEffect(() => {
    // 미팅 참여인원 불러오기
    dispatch({
      type: MEETING_APPLY_REQUEST,
      data: { meetingId: meeting.id },
    });
    // 미팅 게임내역 불러오기
    dispatch({
      type: MEETING_GAME_RESULT_REQUEST,
      data: { meetingId: meeting.id },
    });
  }, [dispatch, meeting.id]);
  // useSelector
  const { meetingDetailState } = useSelector(state => state.mypage);
  const { meetingApplyList, meetingGameList } = useSelector(
    state => state.meetingList
  );
  let cnt = 0; // 회원번호 index
  // let gameCnt = 0; // 게임번호 index
  const FanList = meetingApplyList.map((list, index) => {
    cnt += 1;
    return (
      <div key={index}>
        <Grid container>
          <Grid item xs={0.6}>
            {cnt}.
          </Grid>
          <Grid item xs={2}>
            {list[0]}
          </Grid>
          <Grid item xs={6}>
            {list[1]}
          </Grid>
          <Grid item xs={3.4}>
            {list[2] && '보안 작성 완료'}
          </Grid>
        </Grid>
      </div>
    );
  });
  const GameList = meetingGameList.map((list, index) => {
    console.log(list[0]);
    return (
      <div key={index}>
        <Grid container>
          <Grid item xs={12}>
            <div style={{ fontSize: '20px', marginTop: '20px' }}>
              {index + 1}등 : {list[0]}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  });

  const [toggle, setToggle] = useState(0); // 0 : 미팅 참여 인원, 1 : 미팅 게임 내역

  return (
    <div>
      <Modal
        open={meetingDetailState}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              textAlign: 'center',
              fontSize: '30px',
            }}
          >
            {meeting.name} <br />
            미팅 상세정보
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Grid container>
              <Grid item xs={6}>
                {toggle === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      color: 'red',
                      fontSize: '20px',
                    }}
                    onClick={() => {
                      setToggle(0);
                    }}
                  >
                    미팅 참여 인원
                  </div>
                ) : (
                  <div
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => {
                      setToggle(0);
                    }}
                  >
                    미팅 참여 인원
                  </div>
                )}
              </Grid>
              <Grid item xs={6}>
                {toggle === 1 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      color: 'red',
                      fontSize: '20px',
                    }}
                    onClick={() => {
                      setToggle(1);
                    }}
                  >
                    미팅 게임 내역
                  </div>
                ) : (
                  <div
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => {
                      setToggle(1);
                    }}
                  >
                    미팅 게임 내역
                  </div>
                )}
              </Grid>
            </Grid>
            <br />
            {toggle === 0 && <div>{FanList}</div>}
            {toggle === 1 && (
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '20px',
                  marginTop: '10px',
                }}
              >
                <div style={{ fontSize: '25px' }}>🏆게임 최종 우승자🏆</div>
                {GameList}
              </div>
            )}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
