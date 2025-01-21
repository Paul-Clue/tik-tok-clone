declare module '@mux/mux-node' {
  interface MuxVideo {
    Assets: {
      create: (options: {
        input: Buffer;
        playback_policy: string;
      }) => Promise<{
        id: string;
        playback_ids: Array<{ id: string }>;
      }>;
    };
  }

  class Mux {
    constructor(tokenId: string, tokenSecret: string);
    Video: MuxVideo;
  }

  export default Mux;
}