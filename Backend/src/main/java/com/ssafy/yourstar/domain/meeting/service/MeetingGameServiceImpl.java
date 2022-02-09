package com.ssafy.yourstar.domain.meeting.service;

import com.ssafy.yourstar.domain.meeting.db.entity.MeetingGame;
import com.ssafy.yourstar.domain.meeting.db.repository.MeetingGameRepository;
import com.ssafy.yourstar.domain.meeting.db.repository.MeetingRepositorySpp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeetingGameServiceImpl implements MeetingGameService {

    @Autowired
    MeetingGameRepository meetingGameRepository;

    @Autowired
    MeetingRepositorySpp meetingRepositorySpp;

    @Override
    public List<MeetingGame> meetingGameList(int meetingId) {
        return meetingGameRepository.findMeetingGameByMeetingId(meetingId);
    }

    @Override
    public List<String> meetingGameResultListByUser(int memberId) {
        return meetingGameRepository.fintMeetingResultListByMemberId(memberId);
    }

    @Override
    public List<String> meetingGameResultListByStar(int meetingId) {
        return meetingGameRepository.fintMeetingResultListByMeetingId(meetingId);
    }
}