package com.ssafy.yourstar.domain.meeting.service;

import com.ssafy.yourstar.domain.meeting.db.entity.*;
import com.ssafy.yourstar.domain.meeting.db.repository.*;
import com.ssafy.yourstar.domain.meeting.request.MeetingApplyByStarPostReq;
import com.ssafy.yourstar.domain.meeting.request.MeetingApplyByUserPostReq;
import com.ssafy.yourstar.domain.meeting.request.MeetingOathByUserPostReq;
import com.ssafy.yourstar.domain.meeting.request.MeetingRoomEndByStarPostReq;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class MeetingServiceImpl implements MeetingService {
    @Autowired
    MeetingRepository meetingRepository;

    @Autowired
    MeetingImgPathRepository meetingImgPathRepository;

    @Autowired
    ApplicantRepository applicantRepository;

    @Autowired
    MeetingOathRepository meetingOathRepository;

    @Autowired
    MeetingRepositorySpp meetingRepositorySpp;

    @Value("${app.fileupload.uploadDir}")
    private String uploadFolder;

    @Value("${app.fileupload.uploadPath}")
    private String uploadPath;

    private static final int SUCCESS = 1;
    private static final int FAIL = -1;

    @Override
    public int meetingApplyByStar(MeetingApplyByStarPostReq meetingApplyByStarPostReq, MultipartHttpServletRequest request) throws IOException {
        Meeting meeting = new Meeting();

        meeting.setManagerCode(meetingApplyByStarPostReq.getManagerCode());
        meeting.setMeetingName(meetingApplyByStarPostReq.getMeetingName());
        meeting.setMeetingOpenDate(meetingApplyByStarPostReq.getMeetingOpenDate());
        meeting.setMeetingStartDate(meetingApplyByStarPostReq.getMeetingStartDate());
        meeting.setMeetingEndDate(meetingApplyByStarPostReq.getMeetingEndDate());
        meeting.setMeetingCnt(meetingApplyByStarPostReq.getMeetingCnt());
        meeting.setMeetingPrice(meetingApplyByStarPostReq.getMeetingPrice());
        meeting.setMeetingDescription(meetingApplyByStarPostReq.getMeetingDescription());
        meeting.setApprove(false); // ????????? ??????????????? ????????? ?????? X ????????? ??????

        meetingRepository.save(meeting);

        List<MultipartFile> fileList = request.getFiles("file");
        String rootPath = FileSystemView.getFileSystemView().getHomeDirectory().toString();
        File uploadDir = new File(uploadPath + File.separator + uploadFolder);
        log.warn("FilePath : " + uploadDir.getPath());

        // upload ?????? ???????????? ????????? ??????
        if (!uploadDir.exists()) uploadDir.mkdir();

        for (MultipartFile part : fileList) {

            int meetingId = meeting.getMeetingId();

            String fileName = part.getOriginalFilename();

            // ????????? ?????? ????????? ????????? ????????? ??????
            UUID uuid = UUID.randomUUID();

            // ?????? ????????? ??????
            String extension = FilenameUtils.getExtension(fileName);

            // ????????? ????????? ????????? + ?????????
            String savingFileName = uuid + "." + extension;

            File destFile = new File(uploadPath + File.separator, uploadFolder + File.separator + savingFileName);
            log.warn("destFile : " + destFile.getPath());

            // ?????? ??????
            part.transferTo(destFile);

            // ?????? ?????? DB??? ??????
            MeetingImgPath meetingImgPath = new MeetingImgPath();
            meetingImgPath.setMeetingId(meeting);
            meetingImgPath.setFileName(fileName);
            meetingImgPath.setFileSize(part.getSize());
            meetingImgPath.setFileContentType(part.getContentType());

            String meetingFileUrl = "/" + uploadFolder + "/" + savingFileName;
            meetingImgPath.setFileUrl(meetingFileUrl);

            meetingImgPathRepository.save(meetingImgPath);

            return SUCCESS;
        }
        return FAIL;
    }

    @Override
    public int meetingModifyByStar(Meeting meeting, MultipartHttpServletRequest request) throws IOException {
        // ?????? ???????????? ???????????? ??????
        if (meetingRepository.findById(meeting.getMeetingId()).isPresent()) {

            int meetingId = meetingRepository.findById(meeting.getMeetingId()).get().getMeetingId();

            List<MultipartFile> fileList = request.getFiles("file");

            // ?????? ?????? ??????
            File uploadDir = new File(uploadPath + File.separator + uploadFolder);
            if(!uploadDir.exists()) uploadDir.mkdir();

            // ?????? ?????? ?????? (?????? ?????? ?????? ??????)
            List<String> fileUrlList = meetingImgPathRepository.meetingImgFileUrl(meetingId);

            for (String fileUrl : fileUrlList) {
                File file = new File(uploadPath + File.separator, fileUrl);
                if(file.exists()) {
                    file.delete();
                }
            }

            // ?????? ?????? ???????????? ?????? List??? FileId??? ??????
            List<Integer> fileIdList = meetingImgPathRepository.findFileIdBymeetingId(meetingId);

            for (int fileId : fileIdList) {
                // ?????? ????????? ?????? ?????? DB ??????
                meetingImgPathRepository.deleteById(fileId);
            }

            for (MultipartFile part : fileList) {

                String fileName = part.getOriginalFilename();

                // ????????? ?????? ????????? ????????? ????????? ??????
                UUID uuid = UUID.randomUUID();

                // ?????? ????????? ??????
                String extension = FilenameUtils.getExtension(fileName);

                // ????????? ????????? ????????? + ?????????
                String savingFileName = uuid + "." + extension;

                File destFile = new File(uploadPath + File.separator, uploadFolder + File.separator + savingFileName);

                // ?????? ??????
                part.transferTo(destFile);

                // ?????? ?????? DB??? ??????
                MeetingImgPath meetingImgPath = new MeetingImgPath();
                meetingImgPath.setMeetingId(meeting);
                meetingImgPath.setFileName(fileName);
                meetingImgPath.setFileSize(part.getSize());
                meetingImgPath.setFileContentType(part.getContentType());

                String meetingFileUrl = "/" + uploadFolder + "/" + savingFileName;
                meetingImgPath.setFileUrl(meetingFileUrl);

                meetingImgPathRepository.save(meetingImgPath);
                meetingRepository.save(meeting);

                return SUCCESS;
            }
        }
        return FAIL;
    }

    @Override
    public int meetingRemoveByStar(int meetingId) {
        // ?????? ???????????? ???????????? ??????
        if (meetingRepository.findById(meetingId).isPresent()) {
            int id = meetingRepository.findById(meetingId).get().getMeetingId();

            List<String> fileUrlList = meetingImgPathRepository.meetingImgFileUrl(id);

            for(String fileUrl : fileUrlList) {
                File file = new File(uploadPath + File.separator, fileUrl);
                if(file.exists()) {
                    file.delete();
                }
            }
            meetingRepository.deleteById(meetingId); // ????????? ??????

            return SUCCESS;
        }else return FAIL;
    }

    @Override
    public Page<Meeting> meetingList(Pageable pageable) {return meetingRepository.findAll(pageable);}

    @Override
    public Meeting meetingDetail(int meetingId) {
        if (meetingRepository.findById(meetingId).isPresent()) {
            return meetingRepository.findById(meetingId).get();
        }
        return null;
    }

    @Override
    public Page<Meeting> meetingPendingList(Pageable pageable) {
        return meetingRepository.findAllByIsApproveFalse(pageable);
    }

    @Override
    public Page<Meeting> meetingApproveList(Pageable pageable) {
        LocalDateTime date = LocalDateTime.now().plusHours(9);
        return meetingRepository.findAllByIsApproveTrueAndMeetingStartDateAfter(date, pageable);
    }

    @Override
    public Applicant meetingApplyByUser(MeetingApplyByUserPostReq meetingApplyByUserPostReq) {
        Applicant applicant = new Applicant();

        applicant.setMeetingId(meetingApplyByUserPostReq.getMeetingId());
        applicant.setMemberId(meetingApplyByUserPostReq.getMemberId());
        applicant.setApplicantWarnCount(0); // ?????? ?????? ??? ?????? ????????? 0??????.

        return applicantRepository.save(applicant);
    }

    @Override
    public MeetingOath meetingApplyOathByUser(MeetingApplyByUserPostReq meetingApplyByUserPostReq) {
        MeetingOath meetingOath = new MeetingOath();

        meetingOath.setMeetingId(meetingApplyByUserPostReq.getMeetingId());
        meetingOath.setMemberId(meetingApplyByUserPostReq.getMemberId());
        meetingOath.setIsOath(false);

        return meetingOathRepository.save(meetingOath);
    }

    @Override
    public boolean meetingRemoveByUser(int memberId, int meetingId) {
        // ??????????????? ????????? ID??? ????????? ?????? ??? ??????
        ApplicantID applicantID = new ApplicantID();
        applicantID.setMemberId(memberId);
        applicantID.setMeetingId(meetingId);

        // ?????? ???????????? ??????????????? ?????? ??? ?????? ??? ??????
        if (applicantRepository.findById(applicantID).isPresent()) {
            applicantRepository.deleteById(applicantID);

            return true;
        }
        return false;
    }

    @Override
    public Page<Meeting> meetingApplyListByUser(int memberId, Pageable pageable) {
        // queryDSL??? ????????? ??????
        return meetingRepositorySpp.findAllApplyMeetingByMemberId(memberId, pageable);
//        return applicantRepository.findAllByMemberId(memberId, pageable);
    }

    @Override
    public Page<String> meetingApplyList(int meetingId, Pageable pageable) {
        return meetingRepository.findAllApplyMeetingListByMeetingId(meetingId, pageable);
    }

    @Override
    public Applicant applicantDetail(int memberId, int meetingId) {
        ApplicantID applicantID = new ApplicantID();
        applicantID.setMemberId(memberId);
        applicantID.setMeetingId(meetingId);

        // ?????? ????????? ?????? ????????? null
        if (applicantRepository.findById(applicantID).isPresent()) {
            return applicantRepository.findById(applicantID).get();
        } else {
            return null;
        }
    }

    @Override
    public Applicant meetingGiveWarnToUser(int memberId, int meetingId) {
        ApplicantID applicantID = new ApplicantID();
        applicantID.setMemberId(memberId);
        applicantID.setMeetingId(meetingId);

        // ?????? ????????? ?????? ???????????? ????????? false
        if (applicantRepository.findById(applicantID).isPresent()) {
            Applicant applicant = applicantRepository.findById(applicantID).get();
            applicant.setApplicantWarnCount(applicant.getApplicantWarnCount() + 1); // ?????? ?????? ???????????? +1
            applicantRepository.save(applicant); // ??? ????????????

            return applicant;
        } else {
            return null;
        }
    }

    @Override
    public String getMeetingImgPath(int fileId) {
        MeetingImgPath meetingImgPath = meetingImgPathRepository.findMeetingImgPathByFileId(fileId);
        String path = uploadPath + meetingImgPath.getFileUrl();
        return path;
    }

    @Override
    public MeetingOath meetingOathByUser(MeetingOathByUserPostReq meetingOathByUserPostReq) {
        MeetingOath meetingOath = new MeetingOath();

        meetingOath.setMeetingId(meetingOathByUserPostReq.getMeetingId());
        meetingOath.setMemberId(meetingOathByUserPostReq.getMemberId());
        meetingOath.setIsOath(true);

        return meetingOathRepository.save(meetingOath);
    }

    @Override
    public Meeting meetingEndByStar(MeetingRoomEndByStarPostReq meetingRoomEndByStarPostReq, LocalDateTime meetingEndDate) {
        Meeting meeting = new Meeting();

        if(meetingRepository.findById(meetingRoomEndByStarPostReq.getMeetingId()).isPresent()) {
            int meetingId = meetingRoomEndByStarPostReq.getMeetingId();

            meeting.setMeetingId(meetingId);
            meeting.setMeetingEndDate(meetingEndDate);

            // ????????? ??????
            meeting.setManagerCode(meetingRepository.findById(meetingId).get().getManagerCode());
            meeting.setMeetingName(meetingRepository.findById(meetingId).get().getMeetingName());
            meeting.setMeetingOpenDate(meetingRepository.findById(meetingId).get().getMeetingOpenDate());
            meeting.setMeetingStartDate(meetingRepository.findById(meetingId).get().getMeetingStartDate());
            meeting.setMeetingCnt(meetingRepository.findById(meetingId).get().getMeetingCnt());
            meeting.setMeetingPrice(meetingRepository.findById(meetingId).get().getMeetingPrice());
            meeting.setMeetingDescription(meetingRepository.findById(meetingId).get().getMeetingDescription());
            meeting.setApprove(true);
            meeting.setMeetingRegDt(meetingRepository.findById(meetingId).get().getMeetingRegDt());

            return meetingRepository.save(meeting);
        }else return meeting;
    }
}
