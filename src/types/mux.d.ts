declare module '@mux/mux-node' {
  // interface MuxVideo {
  //   assets: {
  //     create: (options: {
  //       input: string | Buffer;
  //       playback_policy: string[];
  //       encoding_tier?: string;
  //     }) => Promise<{
  //       id: string;
  //       playback_ids: Array<{ id: string }>;
  //     }>;
  //   };
  // }
  interface MuxVideo {
    uploads: {
      create: (options: {
        new_asset_settings: {
          playback_policy: string[];
          encoding_tier?: string;
        };
      }) => Promise<{
        url: string;
        id: string;
        status: string;
        timeout: number;
        test: boolean;
        new_asset_settings: {
          playback_policies: string[];
          encoding_tier: string;
        };
      }>;
      retrieve: (id: string) => Promise<{
        id: string;
        status: string;
        asset_id?: string;
      }>;
    };
    assets: {
      retrieve: (id: string) => Promise<{
        id: string;
        playback_ids: Array<{ id: string }>;
      }>;
    };
  }

  class Mux {
    constructor(tokenId: string, tokenSecret: string);
    video: MuxVideo;
  }

  export default Mux;
}
