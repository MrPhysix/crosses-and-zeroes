import React, { useEffect, useState } from "react";
import Section from "../Section/Section";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import "./App.css";
import xImage from "../../images/x.svg";
import oImage from "../../images/o.svg";

function App() {
  const initialStorage = {
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
    width: "35px",
    height: "35px",
  };

  // fns
  const updateLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  };

  const updateStorage = (newState) => {
    setStorage((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  const checkWinner = (sections) => {
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

  const handleOnHistoryButtonClick = (moveIndex) => {
    const { playerMoved, sections: newSections } = history[moveIndex];

    updateStorage({
      sections: newSections,
      player: !playerMoved,
      currentMove: moveIndex + 1,
      isHistoryUsed: true,
    });

    localStorage.setItem("move", moveIndex + 1);
  };

  const handleOnSectionClick = (number) => {
    if (sections[number] !== null || isGameOver) return;

    const newSections = [...sections];
    newSections[number] = player;

    const newHistory = isHistoryUsed
      ? [
          ...history.slice(0, currentMove),
          { playerMoved: player, sections: newSections },
        ]
      : [...history, { playerMoved: player, sections: newSections }];

    updateStorage({
      sections: newSections,
      player: !player,
      history: newHistory,
      currentMove: currentMove + 1,
      isHistoryUsed: false,
    });
  };

  const handleOnReset = (evt) => {
    evt.preventDefault();
    updateStorage(initialStorage);
  };

  //effects

  useEffect(() => {
    const value = checkWinner(sections);

    if (value !== null) {
      updateStorage({
        winner: value,
        isGameOver: true,
      });
    } else if (winner === null && sections.every((value) => value !== null)) {
      updateStorage({ isGameOver: true });
    }
  }, [sections, winner]);

  useEffect(() => {
    const getFromLocalStorage = () => {
      const history = localStorage.getItem("history");
      const move = localStorage.getItem("move");
      const isHistoryUsed = JSON.parse(localStorage.getItem("isHistoryUsed"));
      //
      const winner = JSON.parse(localStorage.getItem("winner"));
      const isGameOver = JSON.parse(localStorage.getItem("isGameOver"));

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

  useEffect(() => {
    updateLocalStorage("history", JSON.stringify(history));
    updateLocalStorage("move", JSON.stringify(currentMove));
    updateLocalStorage("isHistoryUsed", JSON.stringify(isHistoryUsed));
    //
    updateLocalStorage("winner", JSON.stringify(winner));
    updateLocalStorage("isGameOver", JSON.stringify(isGameOver));
    //
  }, [history, currentMove, isHistoryUsed, winner, isGameOver]);

  // render

  const renderSections = sections.map((item, index) => {
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

  const renderHistory = history.map((item, index) => {
    return (
      <Button
        key={index}
        text={`Back to ${index + 1} move`}
        handleOnClick={(evt) =>
          evt.preventDefault && handleOnHistoryButtonClick(index)
        }
        color={currentMove - 1 === index ? "darkgreen" : "green"}
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
            : `Player ${player ? "1" : "2"}, your turn!`}
        </p>
        {sections && renderSections}
        <div className="appResetButton">
          <Button
            text={"Let’s Go Again!"}
            handleOnClick={handleOnReset}
            color={"#D81D28"}
            isActive={history.some((item) => item)}
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
