"use client";

import React from "react";
import MusicWavePlayer from "@/components/MusicWavePlayer";

export default function MusicPlayerPage() {
  return (
    <div className="music-app-page">
      <MusicWavePlayer isModal={false} />
    </div>
  );
}
