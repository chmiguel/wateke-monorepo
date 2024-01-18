export default class MusicDurationFormatter {
  static format(duration: number): string {
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = duration % 60;

    const durationString = `${durationMinutes}:${
      durationSeconds > 9 ? '' : '0'
    }${durationSeconds}`;
    return durationString;
  }
}
