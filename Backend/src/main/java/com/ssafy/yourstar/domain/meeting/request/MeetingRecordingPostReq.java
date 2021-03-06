package com.ssafy.yourstar.domain.meeting.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel(value = "MeetingRecordingPostReq", description = "팬미팅 영상 녹화 정보")
public class MeetingRecordingPostReq {
    @ApiModelProperty(value = "팬미팅 구분 번호", required = true, example = "3")
    int meetingId;

    @ApiModelProperty(value = "회원 번호", required = true, example = "23")
    int memberId;

    @ApiModelProperty(value = "openvidu record id", required = true, example = "36-4")
    String recordId;
}
