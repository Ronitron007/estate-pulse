"use client";

import { useContext } from "react";
import { SettingsContext } from "./SettingsProvider";

export function useSettings() {
  return useContext(SettingsContext);
}
