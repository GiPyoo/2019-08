import React from "react";
import styled from "styled-components";
import { Sidebar } from "./sidebar";
import { SnugHeader } from "./header";
import { ChannelPlusModal } from "presentation/components/snug/channel-plus-modal";
import { ChannelsProvider } from "contexts/channel-context";
import { ModalProvider } from "contexts/modal-context";
import { MessageSection } from "./message-section";
import { ApplicationChannelMatchProps } from "prop-types/match-extends-types";

const SnugWrapper = styled.section`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
`;

const ViewWrapper = styled.section`
  height: 100%;
  display: flex;
`;

export const Snug: React.FC<ApplicationChannelMatchProps> = props => {
  return (
    <SnugWrapper>
      <ChannelsProvider>
        <ModalProvider>
          <ChannelPlusModal />
          <SnugHeader />
          <ViewWrapper>
            <Sidebar {...props} />
            <MessageSection />
          </ViewWrapper>
        </ModalProvider>
      </ChannelsProvider>
    </SnugWrapper>
  );
};
