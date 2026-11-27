"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PROFILE, type ProfileConfig } from "@/config/profile";

export interface ProfileOverrides {
  name?: string;
  monogram?: string;
  role?: string;
  location?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  availabilityStatus?: "open" | "selective" | "unavailable";
  availabilityLabel?: string;
  photoPreviewUrl?: string | null;
  photoObjectPosition?: string;
}

interface ProfileContextValue {
  profile: ProfileConfig;
  overrides: ProfileOverrides;
  hasOverrides: boolean;
  updateOverrides: (patch: ProfileOverrides) => void;
  resetOverrides: () => void;
  studioOpen: boolean;
  setStudioOpen: (open: boolean) => void;
}

const STORAGE_KEY = "architect-studio-profile-preview-v1";
const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<ProfileOverrides>({});
  const [studioOpen, setStudioOpen] = useState(false);

  // Restore non-blob text overrides from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ProfileOverrides;
      if (parsed && typeof parsed === "object") {
        setOverrides({ ...parsed, photoPreviewUrl: undefined });
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  const updateOverrides = (patch: ProfileOverrides) => {
    setOverrides((prev) => {
      const next = { ...prev, ...patch };
      try {
        const persistable = { ...next };
        delete persistable.photoPreviewUrl;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  };

  const resetOverrides = () => {
    if (overrides.photoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(overrides.photoPreviewUrl);
    }
    setOverrides({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const profile = useMemo<ProfileConfig>(() => {
    const hasCustomName =
      typeof overrides.name === "string" && overrides.name.trim().length > 0;
    return {
      ...PROFILE,
      name: hasCustomName ? overrides.name!.trim() : PROFILE.name,
      monogram:
        overrides.monogram?.trim() ||
        (hasCustomName
          ? overrides
              .name!.trim()
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : PROFILE.monogram),
      isIdentityPlaceholder: hasCustomName
        ? false
        : PROFILE.isIdentityPlaceholder,
      role: overrides.role?.trim() || PROFILE.role,
      location: overrides.location?.trim() || PROFILE.location,
      email: overrides.email?.trim() || PROFILE.email,
      social: {
        ...PROFILE.social,
        github: overrides.github?.trim() || PROFILE.social.github,
        linkedin: overrides.linkedin?.trim() || PROFILE.social.linkedin,
      },
      availability: {
        ...PROFILE.availability,
        status: overrides.availabilityStatus ?? PROFILE.availability.status,
        label: overrides.availabilityLabel?.trim() || PROFILE.availability.label,
      },
      photo: {
        ...PROFILE.photo,
        src:
          overrides.photoPreviewUrl !== undefined
            ? overrides.photoPreviewUrl
            : PROFILE.photo.src,
        objectPosition:
          overrides.photoObjectPosition || PROFILE.photo.objectPosition,
      },
    };
  }, [overrides]);

  const hasOverrides = Object.values(overrides).some(
    (v) => v !== undefined && v !== null && v !== ""
  );

  return (
    <ProfileContext.Provider
      value={{
        profile,
        overrides,
        hasOverrides,
        updateOverrides,
        resetOverrides,
        studioOpen,
        setStudioOpen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    return {
      profile: PROFILE,
      overrides: {},
      hasOverrides: false,
      updateOverrides: () => {},
      resetOverrides: () => {},
      studioOpen: false,
      setStudioOpen: () => {},
    };
  }
  return ctx;
}
