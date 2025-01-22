import Mux from '@mux/mux-node';

const muxClient = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function createMuxAsset(videoFile: File) {
  try {
    const upload = await muxClient.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: "baseline"
      }
    });

    const uploadResponse = await fetch(upload.url, {
      method: 'PUT',
      body: videoFile,
      headers: {
        'Content-Type': videoFile.type,
      }
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status} ${await uploadResponse.text()}`);
    }

    await new Promise(resolve => setTimeout(resolve, 10000));

     let uploadStatus = await muxClient.video.uploads.retrieve(upload.id);
     let attempts = 0;
     const maxAttempts = 10;
 
     while (uploadStatus.status !== 'asset_created' && attempts < maxAttempts) {
       await new Promise(resolve => setTimeout(resolve, 2000));
       uploadStatus = await muxClient.video.uploads.retrieve(upload.id);
       attempts++;
     }
 
     if (!uploadStatus.asset_id) {
       throw new Error('Asset ID not found after upload');
     }

    const asset = await muxClient.video.assets.retrieve(uploadStatus.asset_id);

    return {
      assetId: asset.id,
      playbackId: asset.playback_ids?.[0]?.id,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
