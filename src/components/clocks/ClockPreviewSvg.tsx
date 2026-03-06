import { forwardRef, type JSX } from "react";
import {
  centerBySize,
  numberAngles,
  romanByPosition,
  type ClockSize,
  type NumberStyle,
  type WoodType,
  woodSpecs,
} from "../../lib/clockDesign";

type ClockPreviewSvgProps = {
  size: ClockSize;
  wood: WoodType;
  numberStyle: NumberStyle;
  centerDesignSrc: string | null;
  showReferenceRing?: boolean;
  className?: string;
};

export const ClockPreviewSvg = forwardRef<SVGSVGElement, ClockPreviewSvgProps>(function ClockPreviewSvg(
  { size, wood, numberStyle, centerDesignSrc, showReferenceRing = true, className },
  ref,
): JSX.Element {
  const centerSize = centerBySize[size];
  const maxPreviewOuterRadius = 170;
  const sizeScale = size / 12;
  const previewOuterRadius = Math.round(maxPreviewOuterRadius * sizeScale);
  const centerRadius = previewOuterRadius * (centerSize / size);
  const numberRadius = previewOuterRadius - Math.round(30 * sizeScale);
  const arabicNumberFontSize = Math.round(27 * sizeScale);
  const romanNumberFontSize = Math.round(22 * sizeScale);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 400"
      className={className ?? "mx-auto w-full max-w-[420px]"}
      role="img"
      aria-label={`${size}-inch ${woodSpecs[wood].label} clock preview`}
    >
      <defs>
        {Object.entries(woodSpecs).map(([woodKey, spec]) => (
          <pattern
            key={woodKey}
            id={`wood-${woodKey}`}
            patternUnits="userSpaceOnUse"
            width="220"
            height="220"
          >
            <rect width="220" height="220" fill={spec.tones.base} />
            <path
              d="M-30 16 C 40 0, 110 28, 220 8 M-40 68 C 30 48, 120 88, 230 62 M-35 126 C 45 100, 130 154, 228 122 M-35 182 C 58 154, 140 198, 228 172"
              fill="none"
              stroke={spec.tones.grain}
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.45"
            />
            <path
              d="M-40 34 C 48 14, 140 52, 232 30 M-38 96 C 52 72, 142 122, 230 96 M-38 156 C 52 134, 142 178, 230 152 M-38 214 C 52 190, 142 226, 230 206"
              fill="none"
              stroke={spec.tones.highlight}
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.24"
            />
            <rect width="220" height="220" fill={spec.tones.shadow} opacity="0.16" />
          </pattern>
        ))}
        <clipPath id="center-design-clip">
          <circle cx="200" cy="200" r={centerRadius} />
        </clipPath>
      </defs>

      {showReferenceRing && size === 10 ? (
        <>
          <circle
            cx="200"
            cy="200"
            r={maxPreviewOuterRadius + 8}
            fill="none"
            stroke="#93afff77"
            strokeWidth="1.8"
            strokeDasharray="7 6"
          />
          <text
            x="200"
            y={200 - maxPreviewOuterRadius - 16}
            fill="#d7e3ff"
            fontSize="11"
            textAnchor="middle"
            style={{ letterSpacing: "0.08em" }}
          >
            12" REFERENCE SIZE
          </text>
        </>
      ) : null}

      <circle cx="200" cy="200" r={previewOuterRadius + 8} fill="#0b0b0d" />
      <circle
        cx="200"
        cy="200"
        r={previewOuterRadius + 8}
        fill="none"
        stroke="#93afff88"
        strokeWidth="2"
      />

      <circle cx="200" cy="200" r={previewOuterRadius} fill={`url(#wood-${wood})`} />

      <circle
        cx="200"
        cy="200"
        r={previewOuterRadius}
        fill="none"
        stroke="#1c2235"
        strokeWidth="3"
      />

      {numberAngles.map((mark, index) => {
        const x = 200 + Math.cos(mark.radians) * numberRadius;
        const y = 200 + Math.sin(mark.radians) * numberRadius;
        const label = numberStyle === "roman" ? romanByPosition[index] : String(mark.value);

        return (
          <text
            key={mark.value}
            x={x}
            y={y}
            fill="#f8f8f8"
            fontSize={numberStyle === "roman" ? romanNumberFontSize : arabicNumberFontSize}
            fontWeight="700"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ letterSpacing: numberStyle === "roman" ? "0.06em" : "0.02em" }}
          >
            {label}
          </text>
        );
      })}

      <circle cx="200" cy="200" r={previewOuterRadius - 20} fill="none" stroke="#ebefff55" />

      {centerDesignSrc ? (
        <image
          href={centerDesignSrc}
          x={200 - centerRadius}
          y={200 - centerRadius}
          width={centerRadius * 2}
          height={centerRadius * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#center-design-clip)"
        />
      ) : (
        <circle
          cx="200"
          cy="200"
          r={centerRadius}
          fill="rgba(10, 14, 22, 0.34)"
          stroke="#d9e4ff88"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
      )}

      <circle
        cx="200"
        cy="200"
        r={centerRadius}
        fill="none"
        stroke="#f8f8f8cc"
        strokeWidth="2.4"
      />

      <line x1="200" y1="200" x2="200" y2="118" stroke="#f2f2f2" strokeWidth="5.2" strokeLinecap="round" />
      <line x1="200" y1="200" x2="264" y2="200" stroke="#f2f2f2" strokeWidth="4" strokeLinecap="round" />
      <circle cx="200" cy="200" r="9" fill="#f0f3ff" />
      <circle cx="200" cy="200" r="4.5" fill="#0d1220" />
    </svg>
  );
});
