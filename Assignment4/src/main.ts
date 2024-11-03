import { initializeGame, drawCard, playCard } from "./gameState";
import { GameState } from "./model/GameState";


const gameState: GameState = initializeGame(["Alice", "Bob", "Charlie"]);

const gameStateAfterDraw = drawCard(gameState, 0);


const cardToPlay = gameStateAfterDraw.players[1].hand[0];
const gameStateAfterPlay = playCard(gameStateAfterDraw, 1, cardToPlay);


