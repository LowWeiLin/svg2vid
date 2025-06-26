export const getSupportedVideoFormats = () => {
  const containers = [
    "mp4",
    "webm",
    "ogg",
    "x-matroska",
    "3gpp",
    "3gpp2",
    "3gp2",
    "quicktime",
    "mpeg",
    "aac",
    "flac",
    "wav",
  ];
  const codecs = [
    "vp9",
    "vp8",
    "avc1",
    "av1",
    "h265",
    "h.265",
    "h264",
    "h.264",
    "opus",
    "pcm",
    "aac",
    "mpeg",
    "mp4a",
  ];
  const supportedVideos = containers
    .map((format) => `video/${format}`)
    .filter((mimeType) => MediaRecorder.isTypeSupported(mimeType));
  const supportedVideoCodecs = supportedVideos
    .flatMap((video) => codecs.map((codec) => `${video};codecs=${codec}`))
    .filter((mimeType) => MediaRecorder.isTypeSupported(mimeType));
  return [...supportedVideos, ...supportedVideoCodecs];
};

export const getContainerExtensions = (): { [key: string]: string } => {
  return {
    "x-matroska": "mkv",
    webm: "webm",
    ogg: "ogv",
    mp4: "mp4",
    mpeg: "mpg",
    quicktime: "mov",
  };
};

export const getFileExtensionFromFormat = (outputFormat: string): string => {
  const containerExtensions = getContainerExtensions();
  const container = outputFormat.split(";")[0].split("/")[1];
  return containerExtensions[container] || "webm";
};
