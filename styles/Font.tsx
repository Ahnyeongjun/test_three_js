"use client";

import styled, { css } from "styled-components";

type TypoVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body1"
  | "body2"
  | "caption"
  | "label";

interface FontProps {
  $typo?: TypoVariant;
  $color?: string;
  $weight?: number;
  $align?: "left" | "center" | "right";
}

const typoStyles: Record<TypoVariant, ReturnType<typeof css>> = {
  h1: css`
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
  `,
  h2: css`
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.3;
  `,
  h3: css`
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.4;
  `,
  h4: css`
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.4;
  `,
  body1: css`
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  `,
  body2: css`
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
  `,
  caption: css`
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.4;
  `,
  label: css`
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.4;
  `,
};

export const Font = styled.span<FontProps>`
  ${({ $typo = "body1" }) => typoStyles[$typo]}
  color: ${({ $color, theme }) => $color || theme.colors.text};
  font-weight: ${({ $weight }) => $weight};
  text-align: ${({ $align }) => $align};
`;

export const H1 = styled(Font).attrs({ as: "h1", $typo: "h1" as TypoVariant })``;
export const H2 = styled(Font).attrs({ as: "h2", $typo: "h2" as TypoVariant })``;
export const H3 = styled(Font).attrs({ as: "h3", $typo: "h3" as TypoVariant })``;
export const H4 = styled(Font).attrs({ as: "h4", $typo: "h4" as TypoVariant })``;
export const Body1 = styled(Font).attrs({ $typo: "body1" as TypoVariant })``;
export const Body2 = styled(Font).attrs({ $typo: "body2" as TypoVariant })``;
export const Caption = styled(Font).attrs({ $typo: "caption" as TypoVariant })``;
export const Label = styled(Font).attrs({ $typo: "label" as TypoVariant })``;
