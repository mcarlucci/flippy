import Flippy, { FrontSide, BackSide } from 'react-flippy';
import './App.css';
import questions from './data/questions.json';

function App() {
  const chunkSize = 25;
  const chunks = questions.map((e, i) => {
    return i % chunkSize === 0 ? questions.slice(i, i + chunkSize) : null;
  }).filter(e => e);
  console.log(chunks)

  return (
    <div className="App">
      <h1>Flippy</h1>
      <div className="cards-container">
        {chunks[0].map((question, i) => {
          return (
            <Flippy
              key={i}
              flipOnHover={false} // default false
              flipOnClick={true} // default false
              flipDirection="horizontal" // horizontal or vertical
              // if you pass isFlipped prop component will be controlled component.
              // and other props, which will go to div
              style={{
                color: 'white',
                cursor: 'pointer',
                margin: '0 10px 10px 0',
                height: '200px', 
                width: '200px', 
              }} /// these are optional style, it is not necessary
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
    </div>
  );
}

export default App;
