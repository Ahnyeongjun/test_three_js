"use client";

import { useState } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/Layout";
import { Caption } from "@/styles/Font";
import { useModelStore } from "@/zustand/useModelStore";

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  position: absolute;
  top: 140px;
  left: 24px;
  z-index: 200;
  background: ${({ theme, $isOpen }) =>
    $isOpen ? theme.colors.accent : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 10px 16px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: scale(1.02);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Panel = styled(Column)<{ $isOpen: boolean }>`
  position: absolute;
  top: 200px;
  left: 24px;
  z-index: 200;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  width: 260px;
  max-height: calc(100vh - 260px);
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-120%")});
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`;

const SectionTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MeshItem = styled(Row)<{ $isSelected: boolean }>`
  padding: 10px 12px;
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary + "30" : theme.colors.background};
  border: 1px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary + "40" : theme.colors.border};
    transform: translateX(4px);
  }
`;

const ColorDot = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
`;

const MeshName = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
`;

const SelectedBadge = styled.span`
  font-size: 0.625rem;
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  color: white;
  margin-left: auto;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`;

const DeselectButton = styled.button`
  width: 100%;
  padding: 8px;
  margin-top: ${({ theme }) => theme.spacing.sm};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MovedBadge = styled.span`
  font-size: 0.625rem;
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.background};
  margin-left: auto;
`;

const HelpText = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export default function MeshListPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { meshList, selectedMeshId, setSelectedMeshId, meshPositions, isEditMode } =
    useModelStore();

  const handleMeshClick = (id: string) => {
    setSelectedMeshId(selectedMeshId === id ? null : id);
  };

  const movedCount = Object.keys(meshPositions).length;

  return (
    <>
      <ToggleButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        메쉬 목록
      </ToggleButton>

      <Panel $isOpen={isOpen} $gap="8px">
        <SectionTitle>파츠 목록 ({meshList.length})</SectionTitle>

        {meshList.length === 0 ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : (
          <>
            {meshList.map((mesh) => {
              const isMoved = !!meshPositions[mesh.id];
              const isSelected = selectedMeshId === mesh.id;

              return (
                <MeshItem
                  key={mesh.id}
                  $isSelected={isSelected}
                  $gap="10px"
                  $align="center"
                  onClick={() => handleMeshClick(mesh.id)}
                >
                  <ColorDot $color={mesh.color} />
                  <MeshName>{mesh.name}</MeshName>
                  {isMoved && !isSelected && <MovedBadge>이동됨</MovedBadge>}
                  {isSelected && <SelectedBadge>선택됨</SelectedBadge>}
                </MeshItem>
              );
            })}

            <DeselectButton
              onClick={() => setSelectedMeshId(null)}
              disabled={!selectedMeshId}
            >
              선택 해제
            </DeselectButton>

            {isEditMode && (
              <HelpText>
                편집 모드: 메쉬를 선택 후 드래그하여 이동
              </HelpText>
            )}
          </>
        )}
      </Panel>
    </>
  );
}
