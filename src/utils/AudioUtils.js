export const resetAudio = audio => {
  if (!audio.paused) {
    audio.pause();
  }
  audio.currentTime = 0;
};

export const resetAudioAndPlay = audio => {
  resetAudio(audio);
  audio.play();
};
