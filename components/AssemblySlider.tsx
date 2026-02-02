"use client";

import styled from "styled-components";
import { useModelStore } from "@/zustand/useModelStore";
import { Label } from "@/styles/Font";
import { Column, Row } from "@/styles/Layout";

const SliderContainer = styled(Column)`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  min-width: 320px;
  z-index: 100;
`;

const SliderWrapper = styled(Row)`
  width: 100%;
`;

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.border};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    transition: transform 0.15s ease;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border: none;
    transition: transform 0.15s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const ValueDisplay = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 48px;
  text-align: right;
`;

const StatusText = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
`;

export default function AssemblySlider() {
  const { explodeLevel, setExplodeLevel, isLoading } = useModelStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExplodeLevel(parseFloat(e.target.value));
  };

  const getStatusText = () => {
    if (explodeLevel === 0) return "조립됨";
    if (explodeLevel === 1) return "완전 분리";
    return `분리 중...`;
  };

  return (
    <SliderContainer $gap="12px">
      <Row $justify="space-between" $align="center">
        <Label>조립 / 분리</Label>
        <ValueDisplay>{Math.round(explodeLevel * 100)}%</ValueDisplay>
      </Row>

      <SliderWrapper $gap="16px" $align="center">
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={explodeLevel}
          onChange={handleChange}
          disabled={isLoading}
        />
      </SliderWrapper>

      <Row $justify="space-between" $align="center">
        <StatusText>{getStatusText()}</StatusText>
        {isLoading && <StatusText>모델 로딩 중...</StatusText>}
      </Row>
    </SliderContainer>
  );
}
