import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ChatContent } from "presentation/components/snug/chat-container";
import { ChatInputBox } from "presentation/components/snug/chat-input-box";
import { MessageContextProvider } from "contexts/messages-context";
import { ProfileSection } from "presentation/pages/snug/profile";
import { IconBox } from "presentation/components/atomic-reusable/icon-box";
import LeftArrow from "assets/left-arrow.png";
import RightArrow from "assets/right-arrow.png";
import { Preview } from "presentation/components/snug/preview";
import { AppChannelMatchProps } from "prop-types/match-extends-types";
import { FileUploadModal } from "presentation/components/snug/file-upload-modal";
import { usePathParameter } from "contexts/path-parameter-context";
import { ThreadSection } from "presentation/pages/snug/thread";

const MessageSectionContentWrapper = styled.section`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.snug};
  display: flex;
  flex-direction: column;
  overflow: auto;
`;
const Wrapper = styled.section`
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

const ToggleButton = styled.button`
  height: 40px;
  width: 40px;
  border-bottom-left-radius: 30px;
  border-top-left-radius: 30px;
  background-color: #ffffff;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  font-weight: 900;
  font-size: 1.6rem;
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateX(25%);
  z-index: 5;
`;

export const MessageSectionContent: React.FC<AppChannelMatchProps> = props => {
  const [toggleProfile, setToggleProfile] = useState(false);
  const [onThread, setOnThread] = useState<boolean>(false);
  const [thread, setThread] = useState(0);
  const [replyCount, setReplyCount] = useState<number[]>([]);

  const handleClick = () => {
    setToggleProfile(!toggleProfile);
  };

  const toggleThread = (postId: number) => {
    setThread(postId);
    setOnThread(!onThread);
  };

  const addReplyCount = (postId: number, count: number) => {
    console.log("postId is ", postId);
    console.log("count is ", count);
    console.log("replyCount", replyCount);
    console.log("replyCount[postID]", replyCount[postId]);
    setReplyCount(prevState => {
      const newState = prevState;
      newState[postId] = count + (newState[postId] ? newState[postId] : 0);
      console.log("inside setReplyCount newState is ", newState);
      console.log("inside setReplyCount newState[postId] is", newState[postId]);
      return [...newState];
    });
  };

  const initReplyCount = (replyCountList: number[]) => {
    setReplyCount(replyCountList);
  };

  const resetThread = (postId: number) => {
    setThread(postId);
  };

  const { Application, history } = props;
  const [isParticipated, setIsParticipated] = useState(false);
  const pathParameter = usePathParameter();
  // file upload 모달
  // modal state 관리하는 함수 전달
  // file input changed 발생시 modal 활성화
  const [onModal, setModal] = useState(false);

  useEffect(() => {
    isInParticipating();
  }, [pathParameter]);

  const isInParticipating = async () => {
    try {
      const result = await Application.services.channelService.isInParticipating(
        pathParameter.channelId!
      );
      setIsParticipated(result);
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  // 파일 내용 state
  return (
    <MessageContextProvider>
      <Wrapper>
        {onModal && <FileUploadModal closeModal={closeModal} />}
        <MessageSectionContentWrapper>
          <ChatContent
            {...props}
            isParticipated={isParticipated}
            toggleThread={toggleThread}
            addReplyCount={addReplyCount}
            replyCount={replyCount}
            initReplyCount={initReplyCount}
            onThread={onThread}
            resetThread={resetThread}
          />
          {isParticipated ? (
            <ChatInputBox {...props} openModal={openModal} />
          ) : (
            <Preview {...props} setIsParticipated={setIsParticipated}></Preview>
          )}
        </MessageSectionContentWrapper>
        <ToggleButton onClick={handleClick}>
          {toggleProfile ? (
            <IconBox imageSrc={RightArrow} />
          ) : (
            <IconBox imageSrc={LeftArrow} />
          )}
        </ToggleButton>
        {onThread && (
          <ThreadSection
            thread={thread}
            toggleThread={toggleThread}
            addReplyCount={addReplyCount}
          />
        )}
        <ProfileSection {...props} toggleProfile={toggleProfile} />
      </Wrapper>
    </MessageContextProvider>
  );
};
