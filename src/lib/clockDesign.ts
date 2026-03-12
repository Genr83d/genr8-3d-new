export type ClockSize = 10 | 12;
export type WoodType = "cedar" | "mahogany" | "blueMahoe";
export type NumberStyle = "standardArabic" | "roman";

export type WoodSpec = {
  label: string;
  tones: {
    base: string;
    grain: string;
    shadow: string;
    highlight: string;
  };
};

export const sizeOptions: ClockSize[] = [10, 12];

export const centerBySize: Record<ClockSize, number> = {
  10: 5,
  12: 6,
};

export const woodOrder: WoodType[] = ["cedar", "mahogany", "blueMahoe"];

export const woodSpecs: Record<WoodType, WoodSpec> = {
  cedar: {
    label: "Cedar",
    tones: {
      base: "#bb7547",
      grain: "#8e4f2d",
      shadow: "#58311f",
      highlight: "#d99762",
    },
  },
  mahogany: {
    label: "Mahogany",
    tones: {
      base: "#7f3f34",
      grain: "#5a241d",
      shadow: "#2f1110",
      highlight: "#9f5c4e",
    },
  },
  blueMahoe: {
    label: "Blue Mahoe",
    tones: {
      base: "#6d7c86",
      grain: "#48535c",
      shadow: "#283037",
      highlight: "#90a1ad",
    },
  },
};

export const numberAngles = Array.from({ length: 12 }, (_, index) => ({
  value: index === 0 ? 12 : index,
  radians: ((index * 30 - 90) * Math.PI) / 180,
}));

export const romanByPosition = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

export const numberStyleOptions: Array<{ id: NumberStyle; label: string; sample: string }> = [
  { id: "standardArabic", label: "Standard Arabic", sample: "1 2 3 ... 12" },
  { id: "roman", label: "Roman", sample: "I II III ... XII" },
];

export function looksSpammy(input: string): string[] {
  const flags: string[] = [];
  const normalized = input.toLowerCase();

  if (/https?:\/\/|www\./i.test(normalized)) {
    flags.push("contains_url");
  }
  if (/(casino|viagra|loan|telegram|whatsapp|crypto giveaway)/i.test(normalized)) {
    flags.push("spam_keyword");
  }
  if (/(.)\1{7,}/.test(normalized)) {
    flags.push("repeated_characters");
  }

  return flags;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
        return;
      }
      reject(new Error("Could not convert file to base64."));
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export function svgToBase64DataUrl(svgElement: SVGSVGElement): string {
  const xml = new XMLSerializer().serializeToString(svgElement);
  const bytes = new TextEncoder().encode(xml);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const encoded = window.btoa(binary);
  return `data:image/svg+xml;base64,${encoded}`;
}
