import React from "react";
import styled from "styled-components";
import { ChannelList } from "presentation/components/snug/channel-list";

const SidebarWrapper = styled.section`
  min-width: 250px;
  height: 100%;
  background-color: red;
`;

export const Sidebar: React.FC = () => {
  return (
    <SidebarWrapper>
      <ChannelList></ChannelList>
    </SidebarWrapper>
  );
};