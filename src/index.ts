import WordsAPI from './api/words-api';
import App from './components/app';
import WordCard from './components/student-book/view/words';
import './style.scss';

new App().start();

(async (): Promise<void> => {
  const words = await new WordsAPI().getWords(1, 1);
  console.log(words);
  new WordCard(words[6]).createWordCard();
})();
