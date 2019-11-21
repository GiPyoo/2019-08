import React from "react";
import styled from "styled-components";
import { IconBox } from "presentation/components/atomic-reusable/icon-box";
import Hash from "assets/hash-white.png";
import { History } from "history";
import { match } from "react-router";
import { ChannelMatchType } from "prop-types/channel-match-type";

const Wrapper = styled.section`
  color: #ffffff;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  &:hover {
    opacity: 0.5;
  }
`;

interface PropsTypes {
  title: string;
  history: History<any>;
  match: match<ChannelMatchType>;
}

export const ChannelTitle: React.FC<PropsTypes> = props => {
  const onClickEventHandler = () => {
    const { history, match, title } = props;
    if (match.params.channelId !== title) return;
    history.push(`/${title}`);
  };

  return (
    <Wrapper onClick={onClickEventHandler}>
      <IconBox imageSrc={Hash} />
      {props.title}
    </Wrapper>
  );
};
