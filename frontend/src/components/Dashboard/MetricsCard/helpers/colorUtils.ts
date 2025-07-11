const COLOR_DICTIONARY = {
  positive: "text-[#5AD700]",
  negative: "text-red-600",
  neutral: "text-[#152935]",
} as const;

export const getSecondaryValueColor = (secondaryValue?: string): string => {
  if (!secondaryValue) {
    return COLOR_DICTIONARY.neutral;
  }

  if (secondaryValue.includes("+")) {
    return COLOR_DICTIONARY.positive;
  }

  if (secondaryValue.includes("-")) {
    return COLOR_DICTIONARY.negative;
  }

  return COLOR_DICTIONARY.neutral;
};

export const METRICS_STYLE_CONFIG = {
  globalMetrics: {
    valueColor: "text-[#152935]",
  },
  annualizedReturns: {
    valueColor: "text-[#5AD700]",
    secondaryValueColor: "text-[#5AD700]",
  },
} as const;
