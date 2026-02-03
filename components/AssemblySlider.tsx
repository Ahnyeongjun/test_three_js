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
  min-width: 400px;
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

const ButtonGroup = styled(Row)`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionButton = styled.button<{ $variant?: "primary" | "secondary" | "danger" }>`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case "primary":
        return theme.colors.primary;
      case "danger":
        return "transparent";
      default:
        return "transparent";
    }
  }};

  color: ${({ theme, $variant }) => {
    switch ($variant) {
      case "primary":
        return "#ffffff";
      case "danger":
        return "#ef4444";
      default:
        return theme.colors.text;
    }
  }};

  border-color: ${({ theme, $variant }) => {
    switch ($variant) {
      case "primary":
        return theme.colors.primary;
      case "danger":
        return "#ef4444";
      default:
        return theme.colors.border;
    }
  }};

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme, $variant }) => {
      switch ($variant) {
        case "primary":
          return theme.colors.secondary;
        case "danger":
          return "#ef444420";
        default:
          return theme.colors.border;
      }
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const EditModeBadge = styled.span<{ $active: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#22c55e" : "#6b7280")};
  margin-right: 4px;
`;

export default function AssemblySlider() {
  const {
    explodeLevel,
    setExplodeLevel,
    isLoading,
    isEditMode,
    setIsEditMode,
    meshPositions,
    resetAllPositions,
    setSelectedMeshId
  } = useModelStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExplodeLevel(parseFloat(e.target.value));
  };

  const getStatusText = () => {
    if (explodeLevel === 0) return "조립됨";
    if (explodeLevel === 1) return "완전 분리";
    return `분리 중...`;
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setSelectedMeshId(null);
    }
    setIsEditMode(!isEditMode);
  };

  const movedCount = Object.keys(meshPositions).length;

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
        {movedCount > 0 && <StatusText>{movedCount}개 파츠 이동됨</StatusText>}
      </Row>

      <ButtonGroup $gap="8px">
        <ActionButton
          $variant={isEditMode ? "primary" : undefined}
          onClick={toggleEditMode}
        >
          <EditModeBadge $active={isEditMode} />
          {isEditMode ? "편집 중" : "편집 모드"}
        </ActionButton>

        <ActionButton
          $variant="danger"
          onClick={resetAllPositions}
          disabled={movedCount === 0 && explodeLevel === 0}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          초기화
        </ActionButton>
      </ButtonGroup>
    </SliderContainer>
  );
}
