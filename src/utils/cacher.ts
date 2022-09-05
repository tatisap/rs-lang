import audiocallBackground from '../assets/img/game-landscape.jpeg';
import sprintBackground from '../assets/img/game-waterfall.jpeg';
import mainBackground from '../assets/img/main-page.png';
import gamePageBackground from '../assets/img/game-page.png';

const imageSources: string[] = [
  audiocallBackground,
  sprintBackground,
  mainBackground,
  gamePageBackground,
];

export default class Cacher {
  public preloadPictures(): void {
    imageSources.forEach((src: string): void => {
      new Image().src = src;
    });
  }
}
