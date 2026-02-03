"use client";

import dynamic from "next/dynamic";
import styled from "styled-components";
import { FullScreen, Row, Column } from "@/styles/Layout";
import { H3, Caption } from "@/styles/Font";
import AssemblySlider from "@/components/AssemblySlider";

const ThreeCanvas = dynamic(() => import("@/components/ThreeCanvas"), {
  ssr: false,
  loading: () => <LoadingContainer>3D 뷰포트 로딩 중...</LoadingContainer>,
});

const ShaderControlPanel = dynamic(
  () => import("@/components/ShaderControlPanel"),
  { ssr: false }
);

const ViewportContainer = styled(FullScreen)`
  position: relative;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled(Row)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    to bottom,
    rgba(15, 15, 15, 0.9) 0%,
    transparent 100%
  );
  z-index: 100;
`;

const InfoPanel = styled(Column)`
  position: absolute;
  top: 80px;
  right: 24px;
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;
  max-width: 280px;
`;

const InfoItem = styled(Row)`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const KeyBadge = styled.kbd`
  background: ${({ theme }) => theme.colors.border};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: monospace;
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.2rem;
`;

export default function HomePage() {
  return (
    <ViewportContainer>
      <Header $justify="space-between" $align="center">
        <Column $gap="4px">
          <H3>3D Viewport Test</H3>
          <Caption $color="#a1a1aa">
            Next.js + Three.js + React Three Fiber
          </Caption>
        </Column>
      </Header>

      <ThreeCanvas />

      <ShaderControlPanel />

      <InfoPanel $gap="8px">
        <Caption $color="#a1a1aa">조작 방법</Caption>
        <InfoItem $justify="space-between" $align="center">
          <Caption>회전</Caption>
          <KeyBadge>마우스 좌클릭 드래그</KeyBadge>
        </InfoItem>
        <InfoItem $justify="space-between" $align="center">
          <Caption>줌</Caption>
          <KeyBadge>스크롤 휠</KeyBadge>
        </InfoItem>
        <InfoItem $justify="space-between" $align="center">
          <Caption>이동</Caption>
          <KeyBadge>마우스 우클릭 드래그</KeyBadge>
        </InfoItem>
      </InfoPanel>

      <AssemblySlider />
    </ViewportContainer>
  );
}
