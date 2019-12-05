import React, { useEffect } from "react";
import styled from "styled-components";
import { useMessages, useMessagesDispatch } from "contexts/messages-context";
import { AppSocketChannelMatchProps } from "prop-types/match-extends-types";
import { PostCard } from "presentation/components/snug/post-card";
import { Post } from "core/entity/post";
import { usePathParameter } from "contexts/path-parameter-context";

const ChatContentWrapper = styled.section.attrs({
  id: "scroll"
})`
  min-height: 90%;
  max-height: 90%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-flow: column nowrap;
`;
const Wrapper = styled.section.attrs({})`
  margin-top: auto !important;
`;

export const ChatContent: React.FC<AppSocketChannelMatchProps> = props => {
  const { Application } = props;
  const posts: Post[] = useMessages();
  const dispatch = useMessagesDispatch();
  const pathParameter = usePathParameter();
  useEffect(() => {
    (async function() {
      dispatch({
        type: "CLEAR_ALL"
      });
      const resultPosts = await Application.services.postService.getList(
        pathParameter.channelId
      );
      if (typeof resultPosts == "boolean") return;
      console.log(resultPosts);
      dispatch({
        type: "MULTI_INPUT",
        posts: resultPosts
      });
    })();
  }, [pathParameter]);

  useEffect(() => {
    const obj: HTMLElement = document.getElementById("scroll")!;
    console.log(obj);
    obj.scrollTop = obj.scrollHeight;
  }, [posts]);

  function messageList(): React.ReactNode {
    if (!posts) return <></>;
    return posts!.map((post: Post) => (
      <PostCard
        key={post.id!}
        profile={post.profile}
        contents={post.contents!}
        createdAt={post.createdAt!}
        updatedAt={post.updatedAt!}
      />
    ));
  }

  return (
    <ChatContentWrapper>
      <Wrapper>{messageList()}</Wrapper>
    </ChatContentWrapper>
  );
};
