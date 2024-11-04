import React, { useEffect, useState } from 'react';
import Section from '@components/Section/Section';
import Modal from '@components/Modal/Modal';
import Button from '@components/Button/Button';
import './App.css';
import xImage from '@images/x.svg';
import oImage from '@images/o.svg';
import {
  getCurrentIp,
  initialGame,
  updateCurrentGame,
} from '@utils/api-handlers';

type Section = boolean | null;

export interface History {
  playerMoved?: boolean;
  sections?: Section[];
}

export interface GameState {
  ipAdress?: string;
  sections?: Section[];
  player?: boolean;
  winner?: boolean | null;
  isGameOver?: boolean;
  history?: History[] | [];
  currentMove?: number;
  isHistoryUsed?: boolean;
}

function App(): JSX.Element {
  const initialStorage: GameState = {
    sections: Array(9).fill(null),
    player: true,
    winner: null,
    isGameOver: false,
    history: [],
    currentMove: 0,
    isHistoryUsed: false,
  };

  const [storage, setStorage] = useState(initialStorage);
  const {
    sections,
    player,
    winner,
    isGameOver,
    history,
    currentMove,
    isHistoryUsed,
  } = storage;

  //
  const iconStyle = {
    width: '35px',
    height: '35px',
  };

  // fns
  // const updateLocalStorage = (key, value) => {
  //   localStorage.setItem(key, value);
  // };

  const updateStorage = (newState: GameState) => {
    setStorage((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  const checkWinner = (sections: Section[]) => {
    if (!sections || sections.length < 0) return;

    const combinations = [
      [sections[0], sections[1], sections[2]],
      [sections[3], sections[4], sections[5]],
      [sections[6], sections[7], sections[8]],
      [sections[0], sections[3], sections[6]],
      [sections[1], sections[4], sections[7]],
      [sections[2], sections[5], sections[8]],
      [sections[0], sections[4], sections[8]],
      [sections[2], sections[4], sections[6]],
    ];

    for (let i = 0; i < combinations.length; i++) {
      let current = combinations[i];
      if (
        current[0] !== null &&
        current[0] === current[1] &&
        current[1] === current[2]
      ) {
        return current[0];
      }
    }
    return null;
  };

  //handlers

  const handleOnHistoryButtonClick = (moveIndex: number) => {
    if (!history) return;
    const { playerMoved, sections: newSections } = history[moveIndex];

    updateStorage({
      sections: newSections,
      player: !playerMoved,
      currentMove: moveIndex + 1,
      isHistoryUsed: true,
    });

    // localStorage.setItem('move', moveIndex + 1);
  };

  const handleOnSectionClick = async (number: number) => {
    if (
      !sections ||
      sections[number] !== null ||
      !history ||
      isGameOver ||
      !currentMove
    )
      return;

    const newSections: Section[] = [...sections];
    if (player) newSections[number] = player;

    const newHistory = isHistoryUsed
      ? [
          ...history.slice(0, currentMove),
          { playerMoved: player, sections: newSections },
        ]
      : [...history, { playerMoved: player, sections: newSections }];

    const updatedStorage: GameState = {
      sections: newSections,
      player: !player,
      history: newHistory,
      currentMove: currentMove + 1,
      isHistoryUsed: false,
    };

    console.log('storage on click', storage);
    const ip = await getCurrentIp();

    await updateCurrentGame({
      ipAdress: ip,
      sections: updatedStorage.sections,
      winner: updatedStorage.winner,
      isGameOver: updatedStorage.isGameOver,
      currentMove: updatedStorage.currentMove,
      isHistoryUsed: updatedStorage.isHistoryUsed,
    });

    updateStorage(updatedStorage);
  };

  const handleOnReset = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    updateStorage(initialStorage);
  };

  // handlers-api

  //effects

  useEffect(() => {
    initialGame(updateStorage);
  }, []);

  useEffect(() => {
    console.log('Storage', storage);
  }, [storage]);

  useEffect(() => {
    const value = sections && checkWinner(sections);

    if (value !== null) {
      updateStorage({
        winner: value,
        isGameOver: true,
      });
    } else if (
      winner === null &&
      sections &&
      sections.every((value) => value !== null)
    ) {
      updateStorage({ isGameOver: true });
    }
  }, [sections, winner]);

  useEffect(() => {
    const getFromLocalStorage = () => {
      const history = localStorage.getItem('history');
      const move = localStorage.getItem('move');
      const isHistoryUsed = JSON.parse(
        localStorage.getItem('isHistoryUsed') || 'false'
      );
      //
      const winner = JSON.parse(localStorage.getItem('winner') || 'null');
      const isGameOver = JSON.parse(
        localStorage.getItem('isGameOver') || 'false'
      );

      //
      return { history, move, isHistoryUsed, winner, isGameOver };
    };

    const { history, move, isHistoryUsed, winner, isGameOver } =
      getFromLocalStorage();

    // console.log("history, move, isHistoryUsed", history, move, isHistoryUsed);

    isHistoryUsed && updateStorage({ isHistoryUsed });

    if (history && move) {
      const parsedHistory = JSON.parse(history);
      const parsedMove = JSON.parse(move);

      if (
        Array.isArray(parsedHistory) &&
        parsedHistory.length > 0 &&
        parsedMove > 0
      ) {
        updateStorage({
          sections: parsedHistory[parsedMove - 1].sections,
          currentMove: parsedMove,
          player: !parsedHistory[parsedMove - 1].playerMoved,
          history: parsedHistory,
          //
          isGameOver: isGameOver || winner !== null,
          winner: winner,
        });
      } else {
        updateStorage({
          history: [],
          currentMove: 0,
        });
      }
    }
  }, []);

  // useEffect(() => {
  //   updateLocalStorage('history', JSON.stringify(history));
  //   updateLocalStorage('move', JSON.stringify(currentMove));
  //   updateLocalStorage('isHistoryUsed', JSON.stringify(isHistoryUsed));
  //   //
  //   updateLocalStorage('winner', JSON.stringify(winner));
  //   updateLocalStorage('isGameOver', JSON.stringify(isGameOver));
  //   //
  // }, [history, currentMove, isHistoryUsed, winner, isGameOver]);

  // const fetchAllGames = async () => {
  //   const res = await getAllGames();
  //   console.log(res);
  // };

  // useEffect(() => {
  //   fetchAllGames();
  // }, []);
  // render

  const renderSections =
    sections &&
    sections.map((item, index) => {
      return (
        <Section
          key={index}
          number={index}
          section={item}
          isGameOver={isGameOver}
          handleOnSectionClick={handleOnSectionClick}
        />
      );
    });

  const renderHistory =
    history &&
    history.map((item: History, index: number) => {
      return (
        <Button
          key={index}
          text={`Back to ${index + 1} move`}
          handleOnClick={(evt) => {
            evt.preventDefault;
            handleOnHistoryButtonClick(index);
          }}
          color={
            currentMove && currentMove - 1 === index ? 'darkgreen' : 'green'
          }
          isActive={true}
        />
      );
    });

  return (
    <div className="App">
      <div className="appOptions">
        <div className="optionsInner">
          <p className="playersTitleRow">
            <img style={iconStyle} src={xImage} alt="section-symbol" />- Player
            1
          </p>
          <p className="playersTitleRow">
            <img style={iconStyle} src={oImage} alt="section-symbol" />- Player
            2
          </p>
        </div>
      </div>
      <div className="appContainer">
        <p className="gameStatus">
          {winner
            ? `Victory goes to Player ${winner}!`
            : `Player ${player ? '1' : '2'}, your turn!`}
        </p>
        {sections && renderSections}
        <div className="appResetButton">
          <Button
            text={'Let’s Go Again!'}
            handleOnClick={handleOnReset}
            color={'#D81D28'}
            // isActive={history ? history.some((item: History) => item) : false}
            isActive={false}
          />
        </div>
      </div>
      <div className="appHistory">{history && renderHistory}</div>
      <Modal
        eventState={isGameOver}
        winner={winner}
        // handleOnReset={handleOnReset}
      />
    </div>
  );
}

export default App;
