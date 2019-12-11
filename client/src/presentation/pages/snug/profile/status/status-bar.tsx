import React from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.section`
  height: 70px;
  min-height: 70px;
  max-heigth: 70px;
  border-bottom: 1px black solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

const Header = styled.header`
  color: #000000;
  font-size: 0.7rem;
  margin-bottom: 3px;
  &: hover {
    text-decoration: underline;
  }
`;

const Contents = styled.main`
  color: #3d71a3;
  font-size: 0.9rem;
  &: hover {
    text-decoration: underline;
  }
  ${(props: PointerTypes) => {
    const cursor = props.cursor ? props.cursor : "pointer";
    return css`
      cursor: ${cursor};
    `;
  }}
`;

export interface PropTypes {
  header: string;
  contents: string;
  cursor?: string;
}

export interface PointerTypes {
  cursor?: string;
}

export const StatusBar: React.FC<PropTypes> = props => {
  const { header, contents, cursor } = props;
  return (
    <Wrapper>
      <Header>{header}</Header>
      <Contents cursor={cursor}>{contents}</Contents>
    </Wrapper>
  );
};
