import React, { createContext, Dispatch, useReducer, useContext } from "react";
import { Post } from "core/entity/post";
import { Profile } from "core/entity/profile";

//코드 출처 https://velog.io/@velopert/typescript-context-api
export type Action =
  | {
      type: "CREATE";
      id: number;
      createdAt: string;
      updatedAt: string;
      contents: string;
      profile: Profile;
      filePath?: string;
    }
  | {
      type: "REMOVE";
      id: number;
    }
  | {
      type: "MULTI_INPUT";
      posts?: Post[];
    }
  | {
      type: "FRONT_MULTI_INPUT";
      posts?: Post[];
    }
  | {
      type: "CLEAR_ALL";
    }
  | {
      type: "UPDATE_REPLYCOUNT";
      posts?: Post[];
    }
  | {
      type: "GET_ALL";
    };

type MessageDispatch = Dispatch<Action>;

type Posts = Post[];

const MessagesStateContext = createContext<Posts | undefined>(undefined);

const MessageDispatchContext = createContext<MessageDispatch | undefined>(
  undefined
);

const messageReducer = (state: Posts, action: Action): Posts => {
  switch (action.type) {
    case "CREATE":
      return state.concat({
        id: action.id,
        profile: action.profile,
        createdAt: action.createdAt,
        updatedAt: action.updatedAt,
        contents: action.contents,
        filePath: action.filePath
      });
    case "REMOVE":
      return state.filter(post => post.id !== action.id);
    case "MULTI_INPUT":
      return state.concat(action.posts!.reverse());
    case "FRONT_MULTI_INPUT":
      return action.posts!.reverse().concat(state);
    case "CLEAR_ALL":
      return [];
    case "UPDATE_REPLYCOUNT":
      return [...action.posts!];
    case "GET_ALL":
      return state;
  }
};

export const MessageContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [messages, dispatch] = useReducer(messageReducer, []);
  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessagesStateContext.Provider value={messages}>
        {children}
      </MessagesStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessages = () => {
  const state = useContext(MessagesStateContext);
  if (!state) throw new Error("MessagesProvider not found");
  return state;
};

export const useMessagesDispatch = () => {
  const dispatch = useContext(MessageDispatchContext);
  if (!dispatch) throw new Error("MessagesProvider not found");
  return dispatch;
};
