import { useState, useRef, useMemo, useCallback } from 'react';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import Modal from 'react-modal';
import './App.css';
import questions from './data/questions.json';
import ReactCanvasConfetti from "react-canvas-confetti";

function App() {
  Modal.setAppElement('#root');
  const [shuffledCards, setShuffledCards] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showAddPlayersModal, setShowAddPlayersModal] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const addPlayerInput = useRef(null);
  const cursorText = useRef(null);

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
  
  function shuffleCards() {
    const shuffled = shuffle(questions);
    const numOfCards = 25;
    const shuffledCards = shuffled.map((e, i) => {
      return i % numOfCards === 0 ? shuffled.slice(i, i + numOfCards) : null;
    }).filter(e => e)[0];

    return shuffledCards;
  }

  useMemo(() => {
    setShuffledCards(shuffleCards);
  }, []);


  function addPlayer() {
    const player = addPlayerInput.current.value.trim();
    if (player.length) {
      setPlayers([...players, player]);
      addPlayerInput.current.value = '';
      addPlayerInput.current.focus();
    }
  }

  function resetPlayers() {
    setPlayers([]);
    addPlayerInput.current.value = '';
    cursorText.current.innerText = '';
    addPlayerInput.current.focus();
  }

  function resetGame() {
    setIsFlipped(true);
    fireConfetti();
    setTimeout(() => {
      setIsFlipped(false);
      setShuffledCards(shuffleCards);
      // remove all pointer-events to allow cards to be clicked again
      Array.from(document.querySelectorAll('[style]:not(canvas)')).forEach(el => el.style.pointerEvents = null);
    }, 0)
  }

  function handleAddPlayersModalClose() {
    if (players.length > 1) {
      document.body.onmousemove = moveCursor;
      setCurrentPlayerIndex(0);
      cursorText.current.innerText = `${players[currentPlayerIndex]}'s flip!`;
    }
    setShowAddPlayersModal(false);
  }

  function handleCardFlip(e) {
    // prevent flip card back to front
    e.target.parentElement.parentElement.parentElement.style.pointerEvents = 'none';

    // only show cursor text for 2 or more players
    if (players.length < 2) return;

    // update to next player
    if (currentPlayerIndex === players.length - 1) {
      setCurrentPlayerIndex(0);
      cursorText.current.innerText = `${players[0]}'s flip!`;
    } else {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      cursorText.current.innerText = `${players[currentPlayerIndex + 1]}'s flip!`;
    }
  }

  function moveCursor(e) {
    if (!e) { e = window.event; }
    cursorText.current.style.left = e.pageX + 25 + 'px';
    cursorText.current.style.top = e.pageY - 10 + 'px';
  }

  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio)
      });
  }, []);

  const fireConfetti = useCallback(() => {
    makeShot(0.25, {
      spread: 100,
      startVelocity: 55
    });

    makeShot(0.2, {
      spread: 100
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45
    });
  }, [makeShot]);

  const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    bottom: "-250px",
    left: 0
  };

  return (
    <div className="app">
      <header>
        <span className="title">Flippy</span>
        <div className="header-menu">
          <button className="button" onClick={() => setShowAddPlayersModal(true)}>
            Add Players
          </button>
          <Modal
            isOpen={showAddPlayersModal}
            contentLabel="Add Players"
            className="modal"
            shouldCloseOnEsc={true}
            onAfterOpen={() => console.log('opened')}
          >
            <div className="modal-header">Add Players</div>
            <div className="modal-content">
              <div className="add-players">
                <input placeholder="Enter a players name..." ref={addPlayerInput} disabled={players.length >= shuffledCards.length} onKeyPress={e => e.key === 'Enter' && addPlayer()} type="text" />
                <button className="modal-button" onClick={addPlayer} disabled={players.length >= shuffledCards.length}>Add</button>
              </div>
              <ol className="ordered-list-columns">
                {players.map((player, i) => {
                  return (
                    <li key={i} style={{ display: 'list-item' }}>{player}</li>
                  )
                })
                }
              </ol>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={resetPlayers}>Reset Players</button>
              <button className="modal-button" onClick={handleAddPlayersModalClose}>Done</button>
            </div>
          </Modal>
          &nbsp;&nbsp;&nbsp;
          <button className="button" onClick={resetGame}>
            New Game
          </button>
          &nbsp;&nbsp;&nbsp;
          <button className="button" onClick={() => setShowHowToPlayModal(true)}>
            How to play
          </button>
          <Modal
            isOpen={showHowToPlayModal}
            contentLabel="How to Play"
            className="modal"
            onRequestClose={() => setShowHowToPlayModal(false) }
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
          >
            <div className="modal-close-wrapper">
              <div className="modal-header"><span>How to Play</span></div> <button className="modal-close" onClick={() => setShowHowToPlayModal(false)}>&#x2715;</button>
            </div>
            <div className="modal-content">
              <ol className="ordered-list">
                <li>Screenshare this with a group</li>
                <li>As the moderator, add players using the 'Add Players' button</li>
                <li>Have each person take turns picking a card to flip and answering the question on the back</li>
              </ol>
            </div>
          </Modal>
        </div>
      </header>
      <div className="cards-container">
        {shuffledCards && shuffledCards && shuffledCards.map((question, i) => {
          return (
            <Flippy
              isFlipped={isFlipped}
              className="card"
              key={i}
              flipDirection="horizontal"
              onClick={handleCardFlip}
            >
              <FrontSide
                style={{
                  alignItems: 'center',
                  backgroundColor: 'teal',
                  borderRadius: '8px',
                  display: 'flex',
                  fontFamily: 'Pacifico, cursive',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </FrontSide>
              <BackSide
                style={{
                  alignItems: 'center',
                  backgroundColor: 'teal',
                  borderRadius: '8px',
                  fontSize: '16px',
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
        Made with&nbsp;<span style={{ color: "#e25555" }}>&#9829;</span>&nbsp;by <a href="https://github.com/mcarlucci" target="_blank" rel="noreferrer">&nbsp;Matt Carlucci</a>
      </footer>
      <div id="cursorText" ref={cursorText}></div>
      <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
    </div>
  );
}

export default App;
