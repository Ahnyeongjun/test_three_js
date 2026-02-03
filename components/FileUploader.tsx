"use client";

import { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/Layout";
import { Caption } from "@/styles/Font";
import { useModelStore } from "@/zustand/useModelStore";

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  position: absolute;
  top: 200px;
  left: 24px;
  z-index: 200;
  background: ${({ theme, $isOpen }) =>
    $isOpen ? theme.colors.secondary : theme.colors.surface};
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
    background: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.02);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Panel = styled(Column)<{ $isOpen: boolean }>`
  position: absolute;
  top: 260px;
  left: 24px;
  z-index: 200;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  width: 300px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-120%")});
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
`;

const SectionTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DropZone = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed
    ${({ theme, $isDragging }) =>
      $isDragging ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme, $isDragging }) =>
    $isDragging ? theme.colors.primary + "20" : theme.colors.background};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary + "10"};
  }
`;

const DropIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DropText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const DropHint = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const HiddenInput = styled.input`
  display: none;
`;

const CurrentModel = styled(Row)`
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ModelIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary + "30"};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const ModelInfo = styled(Column)`
  flex: 1;
  min-width: 0;
`;

const ModelName = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ModelType = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.border};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const TestModelButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: ${({ theme }) => theme.spacing.sm};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ErrorMessage = styled.div`
  padding: 10px;
  background: #ef4444 + "20";
  border: 1px solid #ef4444;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export default function FileUploader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { modelUrl, modelName, setModelUrl, setModelName, setIsLoading } = useModelStore();

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      const validExtensions = [".gltf", ".glb"];
      const fileName = file.name.toLowerCase();
      const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

      if (!isValid) {
        setError("GLTF 또는 GLB 파일만 지원됩니다.");
        return;
      }

      // 이전 URL 해제
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }

      setIsLoading(true);
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      setModelName(file.name);
    },
    [modelUrl, setModelUrl, setModelName, setIsLoading]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
    setModelUrl(null);
    setModelName(null);
    setError(null);
    // input 리셋
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [modelUrl, setModelUrl, setModelName]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <ToggleButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        에셋 업로드
      </ToggleButton>

      <Panel $isOpen={isOpen} $gap="0">
        <SectionTitle>3D 모델 업로드</SectionTitle>

        <DropZone
          $isDragging={isDragging}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <DropIcon>📦</DropIcon>
          <DropText>파일을 드래그하거나 클릭하세요</DropText>
          <DropHint>GLTF, GLB 지원</DropHint>
        </DropZone>

        <HiddenInput
          ref={inputRef}
          type="file"
          accept=".gltf,.glb"
          onChange={handleInputChange}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {modelName && (
          <CurrentModel $gap="12px" $align="center">
            <ModelIcon>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </ModelIcon>
            <ModelInfo $gap="2px">
              <ModelName title={modelName}>{modelName}</ModelName>
              <ModelType>업로드된 모델</ModelType>
            </ModelInfo>
            <RemoveButton onClick={handleRemove} title="제거">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </RemoveButton>
          </CurrentModel>
        )}

        {modelUrl && (
          <TestModelButton onClick={handleRemove}>
            테스트 모델로 돌아가기
          </TestModelButton>
        )}
      </Panel>
    </>
  );
}
