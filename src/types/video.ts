export interface VideoMetadata {
  name: string;
  src: string;
  poster: string;
  status: string;
  originalFilePath: string;
  provider: string;
  providerMetadata: {
    mux: {
      uploadId: string;
      assetId: string;
      playbackId: string;
    };
  };
  createdAt: number;
  updatedAt: number;
  size: number;
  sources: Array<{
    src: string;
    type: string;
  }>;
}

export interface VideoType extends VideoMetadata {
  name: string;
}