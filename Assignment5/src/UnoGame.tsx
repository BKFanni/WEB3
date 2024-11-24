
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { drawCard, playCard, changeTurn } from './reduxStore';

const UnoGame = () => {
  const gameState = useSelector((state) => state.gameState);
  const dispatch = useDispatch();

  const handleDrawCard = () => {
    dispatch(drawCard(gameState.currentPlayerIndex));
  };

  const handlePlayCard = () => {
    if (gameState.players[gameState.currentPlayerIndex].hand.length > 0) {
      const card = gameState.players[gameState.currentPlayerIndex].hand[0];
      dispatch(playCard(gameState.currentPlayerIndex, card));
    }
  };

  const handleChangeTurn = () => {
    dispatch(changeTurn());
  };

  return (
    <div>
      <h1>UNO Game</h1>
      <p>Current Player: {gameState.currentPlayerIndex}</p>
      <button onClick={handleDrawCard}>Draw Card</button>
      <button onClick={handlePlayCard}>Play Card</button>
      <button onClick={handleChangeTurn}>Change Turn</button>
      <div>
        <h2>Players</h2>
        {gameState.players.map((player, index) => (
          <div key={index}>
            <h3>Player {index}</h3>
            <p>Hand: {player.hand.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnoGame;
