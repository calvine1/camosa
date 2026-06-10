"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { uploadProfilePicture } from "@/lib/auth/avatar";
import type { UserRole } from "@/store/useAuthStore";
import UserAvatar from "./UserAvatar";

type ProfilePictureUploadProps = {
  userId: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  onUploaded: (url: string) => void;
};

export default function ProfilePictureUpload({
  userId,
  name,
  role,
  avatarUrl,
  onUploaded,
}: ProfilePictureUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage(null);
    setIsUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const supabase = createClient();
    const result = await uploadProfilePicture(supabase, userId, file);

    URL.revokeObjectURL(objectUrl);
    setIsUploading(false);

    if ("error" in result) {
      setPreviewUrl(null);
      setMessage({ text: result.error, error: true });
      return;
    }

    setPreviewUrl(result.url);
    onUploaded(result.url);
    setMessage({ text: "Profile picture updated.", error: false });
    event.target.value = "";
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative">
        {previewUrl ? (
          <div className="w-24 h-24 rounded-full border border-border overflow-hidden bg-secondary">
            <img src={previewUrl} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <UserAvatar
            userId={userId}
            name={name}
            role={role}
            avatarUrl={avatarUrl}
            size="xl"
          />
        )}
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-background/70 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Profile picture</p>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, or WebP. Maximum size 2MB.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full font-bold"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Change photo"}
        </Button>
        {message && (
          <p
            className={`text-xs font-semibold ${message.error ? "text-destructive" : "text-emerald-500"}`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
