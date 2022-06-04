import Flippy, { FrontSide, BackSide } from 'react-flippy';
import './App.css';
import questions from './data/questions.json';

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function App() {
  const numOfCards = 25;
  const shuffledCards = shuffle(questions);

  const cards = shuffledCards.map((e, i) => {
    return i % numOfCards === 0 ? shuffledCards.slice(i, i + numOfCards) : null;
  }).filter(e => e);

  return (
    <div className="App">
      <h1>Flippy</h1>
      <div className="cards-container">
        {cards[0].map((question, i) => {
          return (
            <Flippy
              className="card"
              key={i}
              flipOnHover={false} // default false
              flipOnClick={true} // default false
              flipDirection="horizontal"
            >
              <FrontSide 
                style={{
                  alignItems: 'center',
                  backgroundColor: 'teal',
                  display: 'flex',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                }} >
                {i + 1}
              </FrontSide>
              <BackSide 
                style={{
                  alignItems: 'center',
                  backgroundColor: 'teal',
                  fontSize: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                {question}
              </BackSide>
            </Flippy>
          )
          })
        }
      </div>
      <footer>
        Made with <span style={{ color: "#e25555" }}>&#9829;</span> by <a href="http://www.mcarlucci.com" target="_blank" rel="noreferrer">Matt Carlucci</a>
      </footer>
    </div>
  );
}

export default App;
