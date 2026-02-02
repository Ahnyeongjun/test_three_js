"use client";

import styled, { css } from "styled-components";
import { media } from "./breakpoints";

interface DivProps {
  $padding?: string;
  $margin?: string;
  $width?: string;
  $height?: string;
  $minHeight?: string;
  $maxWidth?: string;
  $bg?: string;
  $radius?: string;
  $shadow?: string;
  $border?: string;
  $overflow?: string;
  $position?: "relative" | "absolute" | "fixed" | "sticky";
}

export const Div = styled.div<DivProps>`
  padding: ${({ $padding }) => $padding};
  margin: ${({ $margin }) => $margin};
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  min-height: ${({ $minHeight }) => $minHeight};
  max-width: ${({ $maxWidth }) => $maxWidth};
  background: ${({ $bg }) => $bg};
  border-radius: ${({ $radius }) => $radius};
  box-shadow: ${({ $shadow }) => $shadow};
  border: ${({ $border }) => $border};
  overflow: ${({ $overflow }) => $overflow};
  position: ${({ $position }) => $position};
`;

interface FlexProps extends DivProps {
  $gap?: string;
  $justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  $align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  $wrap?: "nowrap" | "wrap" | "wrap-reverse";
  $flex?: string;
}

const flexStyles = css<FlexProps>`
  display: flex;
  gap: ${({ $gap }) => $gap};
  justify-content: ${({ $justify }) => $justify};
  align-items: ${({ $align }) => $align};
  flex-wrap: ${({ $wrap }) => $wrap};
  flex: ${({ $flex }) => $flex};
`;

export const Row = styled(Div)<FlexProps>`
  ${flexStyles}
  flex-direction: row;
`;

export const Column = styled(Div)<FlexProps>`
  ${flexStyles}
  flex-direction: column;
`;

interface GridProps extends DivProps {
  $columns?: string;
  $rows?: string;
  $gap?: string;
  $columnGap?: string;
  $rowGap?: string;
  $areas?: string;
  $responsive?: boolean;
}

export const Grid = styled(Div)<GridProps>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns || "1fr"};
  grid-template-rows: ${({ $rows }) => $rows};
  gap: ${({ $gap }) => $gap};
  column-gap: ${({ $columnGap }) => $columnGap};
  row-gap: ${({ $rowGap }) => $rowGap};
  grid-template-areas: ${({ $areas }) => $areas};

  ${({ $responsive }) =>
    $responsive &&
    css`
      ${media.tablet} {
        grid-template-columns: 1fr;
      }
    `}
`;

export const Container = styled(Div)`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  ${media.tablet} {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

export const FullScreen = styled(Div)`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;
