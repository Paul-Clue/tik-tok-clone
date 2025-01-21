import Mux from '@mux/mux-node';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);
// const muxClient = new Mux();
// const Video = muxClient.video;

export async function createMuxAsset(videoFile: File) {
  const buffer = Buffer.from(await videoFile.arrayBuffer());

  // const asset = await Video.assets.create({
  //   input: buffer,
  //   playback_policy: 'public',
  // });
  // const asset = await Video.Assets.create({
  //   input: [{
  //     url: buffer.toString('base64'),
  //   }],
  //   playback_policy: ['public'],
  // });
  const asset = await Video.Assets.create({
    input: buffer,
    playback_policy: 'public',
  });

  return {
    assetId: asset.id,
    playbackId: asset.playback_ids?.[0]?.id,
  };
}