import { useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useEffect, useLayoutEffect as useOriginalLayoutEffect } from "react";

// Silence silly warning
// https://reactjs.org/link/uselayouteffect-ssr
export const useLayoutEffect =
  typeof window === "undefined" ? useEffect : useOriginalLayoutEffect;

export function useFocusRef<T extends HTMLOrSVGElement>(isSelected: boolean) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (!isSelected) return;
    ref.current?.focus({ preventScroll: true });
  }, [isSelected]);

  return {
    ref,
    tabIndex: isSelected ? 0 : -1,
  };
}
