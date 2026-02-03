"use client";

import { useState } from "react";
import styled from "styled-components";
import { Column, Row } from "@/styles/Layout";
import { Caption } from "@/styles/Font";
import { useRenderStore } from "@/zustand/useRenderStore";

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  position: absolute;
  top: 80px;
  left: 24px;
  z-index: 200;
  background: ${({ theme, $isOpen }) =>
    $isOpen ? theme.colors.primary : theme.colors.surface};
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
    background: ${({ theme }) => theme.colors.primary};
    transform: scale(1.02);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Panel = styled(Column)<{ $isOpen: boolean }>`
  position: absolute;
  top: 140px;
  left: 24px;
  z-index: 200;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  width: 300px;
  max-height: calc(100vh - 200px);
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

const Section = styled(Column)`
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SliderRow = styled(Column)`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SliderLabel = styled(Row)`
  justify-content: space-between;
  margin-bottom: 4px;
`;

const SliderValue = styled.span`
  font-family: monospace;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.background};
  padding: 2px 6px;
  border-radius: 4px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.background};
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    transition: transform 0.15s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border: none;
  }
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: SliderControlProps) {
  return (
    <SliderRow>
      <SliderLabel>
        <Caption>{label}</Caption>
        <SliderValue>{value.toFixed(2)}</SliderValue>
      </SliderLabel>
      <Slider
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </SliderRow>
  );
}

export default function ShaderControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { bloom, ao, material, lighting, setBloom, setAO, setMaterial, setLighting, reset } =
    useRenderStore();

  return (
    <>
      <ToggleButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        쉐이더 설정
      </ToggleButton>

      <Panel $isOpen={isOpen} $gap="0">
        <Section $gap="4px">
          <SectionTitle>Bloom 효과</SectionTitle>
          <SliderControl
            label="강도"
            value={bloom.intensity}
            min={0}
            max={2}
            step={0.05}
            onChange={(v) => setBloom({ intensity: v })}
          />
          <SliderControl
            label="임계값"
            value={bloom.threshold}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => setBloom({ threshold: v })}
          />
          <SliderControl
            label="부드러움"
            value={bloom.smoothing}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => setBloom({ smoothing: v })}
          />
        </Section>

        <Section $gap="4px">
          <SectionTitle>앰비언트 오클루전</SectionTitle>
          <SliderControl
            label="반경"
            value={ao.radius}
            min={0.1}
            max={2}
            step={0.05}
            onChange={(v) => setAO({ radius: v })}
          />
          <SliderControl
            label="강도"
            value={ao.intensity}
            min={0}
            max={5}
            step={0.1}
            onChange={(v) => setAO({ intensity: v })}
          />
        </Section>

        <Section $gap="4px">
          <SectionTitle>재질</SectionTitle>
          <SliderControl
            label="거칠기"
            value={material.roughness}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => setMaterial({ roughness: v })}
          />
          <SliderControl
            label="금속성"
            value={material.metalness}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => setMaterial({ metalness: v })}
          />
          <SliderControl
            label="환경맵 강도"
            value={material.envMapIntensity}
            min={0}
            max={3}
            step={0.1}
            onChange={(v) => setMaterial({ envMapIntensity: v })}
          />
        </Section>

        <Section $gap="4px">
          <SectionTitle>조명</SectionTitle>
          <SliderControl
            label="메인 조명 강도"
            value={lighting.keyLightIntensity}
            min={0}
            max={5}
            step={0.1}
            onChange={(v) => setLighting({ keyLightIntensity: v })}
          />
          <SliderControl
            label="앰비언트 강도"
            value={lighting.ambientIntensity}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => setLighting({ ambientIntensity: v })}
          />
        </Section>

        <ResetButton onClick={reset}>기본값으로 초기화</ResetButton>
      </Panel>
    </>
  );
}
