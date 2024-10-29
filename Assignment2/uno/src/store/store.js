import { createStore } from "vuex";
import { createGame, PlayerType } from "../game/Uno.ts";

export default createStore({
  state: {
    unoGame: null, // Stores the main Uno game object
    currentPlayerIndex: 0, // Tracks the current player's turn
    discardPile: [], // Tracks cards placed in the discard pile
    gameOver: false, // Boolean to track if the game is over
    players: [], // Player names and types
  },

  mutations: {
    // Initializes the game with provided player information
    initializeGame(state, { players, targetScore, startingCards }) {
      const playerMap = new Map(
        players.map((player) => [player.name, player.type])
      );
      state.unoGame = createGame(playerMap, targetScore, startingCards);
      state.players = Array.from(playerMap.keys());
      state.discardPile = [];
      state.gameOver = false;
      state.currentPlayerIndex = state.unoGame.currentPlayer;
    },

    // Updates the deck after a player or bot move
    updateDeckState(state, updatedDeck) {
      state.unoGame.currentDeck = updatedDeck;
      state.discardPile = updatedDeck.placedCards;
    },

    // Advances to the next player based on the game state
    setNextPlayer(state) {
      state.currentPlayerIndex = state.unoGame.nextPlayer();
    },

    // Ends the game
    endGame(state) {
      state.gameOver = true;
    },
  },

  actions: {
    initializeGame({ commit }, gameConfig) {
      commit("initializeGame", gameConfig);
    },

    // Handles player moves and updates the deck accordingly
    playerPlayCard({ commit, state }, { cardIndex, wildcardColor }) {
      const currentPlayer = state.unoGame.currentPlayer;
      const card = state.unoGame.playerName(currentPlayer).cards[cardIndex];

      try {
        // Ensures color is set for Wild cards
        if (
          (card.type === "Wild" || card.type === "Wild Draw Four") &&
          wildcardColor === undefined
        ) {
          throw new Error("Wild cards require a color selection!");
        }

        if (card.type === "Wild" || card.type === "Wild Draw Four") {
          state.unoGame
            .playerName(currentPlayer)
            .changeWildcardColor(cardIndex, wildcardColor);
        }

        const updatedDeck = state.unoGame.playerMove(cardIndex, wildcardColor);
        commit("updateDeckState", updatedDeck);
        commit("setNextPlayer");

        // Check and call Uno if only one card is left
        if (state.unoGame.cardAmount(currentPlayer) === 1) {
          state.unoGame.callUno(currentPlayer);
        }

        // Trigger bot move if the next player is a bot
        const nextPlayerType = state.unoGame.playerName(
          state.currentPlayerIndex
        ).playerType;
        if (nextPlayerType !== PlayerType.Player) {
          this.dispatch("botPlayCard");
        }
      } catch (error) {
        console.error(error.message);
      }
    },

    // Handles bot moves using the bot logic
    botPlayCard({ commit, state }) {
      try {
        const updatedDeck = state.unoGame.botMove();
        commit("updateDeckState", updatedDeck);
        commit("setNextPlayer");

        // Trigger another bot move if the next player is also a bot
        const nextPlayerType = state.unoGame.playerName(
          state.currentPlayerIndex
        ).playerType;
        if (nextPlayerType !== PlayerType.Player && !state.gameOver) {
          this.dispatch("botPlayCard");
        }
      } catch (error) {
        console.error(error.message);
      }
    },

    playerPickCard({ commit, state }, playerIndex) {
      try {
        const [updatedDeck] = state.unoGame.playerPickCard(playerIndex); // Remove `updatedHand`
        commit("updateDeckState", updatedDeck);
      } catch (error) {
        console.error(error.message);
      }
    },

    // Calls Uno for the player if they have only one card left
    callUno({ state }, playerIndex) {
      try {
        state.unoGame.callUno(playerIndex);
      } catch (error) {
        console.error(error.message);
      }
    },

    // Accuses a player of failing to call Uno
    accuseUno({ state }, playerIndex) {
      try {
        return state.unoGame.accuseUno(playerIndex);
      } catch (error) {
        console.error(error.message);
      }
    },

    // Ends the game by setting the gameOver flag
    endGame({ commit }) {
      commit("endGame");
    },
  },

  getters: {
    currentPlayer(state) {
      return state.unoGame
        ? state.unoGame.playerName(state.currentPlayerIndex)
        : null;
    },
    currentDeck(state) {
      return state.unoGame ? state.unoGame.currentDeck : null;
    },
    gameOver(state) {
      return state.gameOver;
    },
  },
});
