import { defineStore } from "pinia";
import {
  generateDeck,
  shuffleDeck,
  dealCards,
  isValidMove,
  calculateScore,
} from "../gameLogic/helper";

export const useGameStore = defineStore("game", {
  state: () => ({
    players: [], // Array of players' hands
    drawPile: [], // Remaining cards in the draw pile
    discardPile: [], // Cards in the discard pile
    currentPlayer: 0, // Index of the current player
    direction: 1, // 1 for clockwise, -1 for counterclockwise
    scores: {}, // Object to track scores for all players
    unoCallPending: false, // Whether an Uno call is pending
    botTypes: [], // Array to store bot intelligence types
  }),

  actions: {
    /**
     * Handles a player or bot calling "Uno."
     * @param {Number} playerIndex - The index of the player calling "Uno."
     */
    callUno(playerIndex) {
      if (this.unoCallPending && this.players[playerIndex].length === 1) {
        // Successfully called Uno
        this.unoCallPending = false;
        console.log(`Player ${playerIndex + 1} successfully called Uno!`);
      } else {
        // Penalize for invalid call or failure to call
        console.log(
          `Player ${
            playerIndex + 1
          } failed to call Uno or made an invalid call!`
        );
        // Add penalty cards (e.g., 2 cards) for failure
        this.players[playerIndex].push(
          this.drawPile.pop(),
          this.drawPile.pop()
        );
      }
    },
    /**
     * Sets the intelligence types for bots.
     * @param {Array} types - Array of bot intelligence types (e.g., ['smart', 'stupid']).
     */
    setBotTypes(types) {
      this.botTypes = types;
    },

    /**
     * Initializes the game by setting up players, shuffling the deck, and dealing cards.
     * @param {Number} numPlayers - Total number of players (including bots).
     */
    initializeGame(numPlayers) {
      const deck = generateDeck();
      const { playerHands, deck: updatedDeck } = dealCards(deck, numPlayers);

      this.players = playerHands;
      this.drawPile = updatedDeck;
      this.discardPile = [this.drawPile.pop()];
      this.currentPlayer = 0;
      this.direction = 1;

      // Reset scores if it's the start of a new game
      if (Object.keys(this.scores).length === 0) {
        for (let i = 0; i < numPlayers; i++) {
          this.scores[i] = 0;
        }
      }

      this.startNextTurn(); // Start the first turn
    },

    /**
     * Handles playing a card.
     * @param {Number} playerIndex - Index of the player attempting to play a card.
     * @param {Object} card - Card the player wants to play.
     */
    playCard(playerIndex, card) {
      const topCard = this.discardPile[this.discardPile.length - 1];
      if (isValidMove(card, topCard)) {
        this.discardPile.push(card);
        this.players[playerIndex].splice(
          this.players[playerIndex].indexOf(card),
          1
        );

        // Handle special cards
        this.handleSpecialCard(card);

        // Check if the player has one card left (Uno call logic)
        if (this.players[playerIndex].length === 1) {
          this.unoCallPending = true;
        }

        // Check for game end condition
        if (this.players[playerIndex].length === 0) {
          this.calculateScores();
          // Navigate to Game Over screen or handle game over logic
          return;
        }

        // Advance to the next turn
        this.startNextTurn();
      }
    },

    /**
     * Handles drawing a card.
     * @param {Number} playerIndex - Index of the player drawing a card.
     */
    drawCard(playerIndex) {
      if (this.drawPile.length === 0) {
        this.reshuffleDrawPile();
      }

      this.players[playerIndex].push(this.drawPile.pop());
      this.startNextTurn();
    },

    /**
     * Handles the bot's turn based on its intelligence type.
     */
    botTurn() {
      const botIndex = this.currentPlayer;
      const botHand = this.players[botIndex];
      const topCard = this.discardPile[this.discardPile.length - 1];

      const botType = this.botTypes[botIndex - 1]; // Bot types correspond to indices 1, 2, 3 (excluding player)

      let validCard;

      if (botType === "smart") {
        // Smart bot logic: prioritize special cards or strategic moves
        validCard = botHand.find(
          (card) => isValidMove(card, topCard) && this.isStrategicCard(card)
        );
        if (!validCard) {
          // If no strategic card, play any valid card
          validCard = botHand.find((card) => isValidMove(card, topCard));
        }
      } else {
        // Stupid bot logic: play the first valid card
        validCard = botHand.find((card) => isValidMove(card, topCard));
      }

      if (validCard) {
        this.playCard(botIndex, validCard);
      } else {
        // If no valid card, draw a card
        this.drawCard(botIndex);
      }
    },

    /**
     * Determines if a card is strategic (e.g., special action cards).
     * @param {Object} card - The card to evaluate.
     * @returns {Boolean} True if the card is strategic.
     */
    isStrategicCard(card) {
      const strategicValues = [
        "reverse",
        "skip",
        "drawTwo",
        "wild",
        "wildDrawFour",
      ];
      return strategicValues.includes(card.value);
    },

    /**
     * Starts the next turn.
     */
    startNextTurn() {
      const numPlayers = this.players.length;
      this.currentPlayer =
        (this.currentPlayer + this.direction + numPlayers) % numPlayers;

      // If it's a bot's turn, trigger the bot's action
      if (this.currentPlayer !== 0) {
        setTimeout(() => {
          this.botTurn();
        }, 1000); // Delay to simulate bot thinking
      }
    },

    /**
     * Reshuffles the discard pile back into the draw pile when the draw pile is empty.
     */
    reshuffleDrawPile() {
      const newDrawPile = shuffleDeck(this.discardPile.slice(0, -1)); // Keep the last card as the top discard
      this.discardPile = [this.discardPile[this.discardPile.length - 1]];
      this.drawPile = newDrawPile;
    },

    /**
     * Handles special card logic (e.g., skip, reverse, drawTwo, wild, wildDrawFour).
     * @param {Object} card - Card to handle.
     */
    handleSpecialCard(card) {
      switch (card.value) {
        case "skip":
          this.startNextTurn(); // Skip the next player's turn
          break;
        case "reverse":
          this.direction *= -1; // Reverse the turn direction
          break;
        case "drawTwo":
          this.startNextTurn();
          this.players[this.currentPlayer].push(
            this.drawPile.pop(),
            this.drawPile.pop()
          );
          break;
        case "wild":
        case "wildDrawFour":
          // Wilds require choosing a color; for bots, select a random color
          if (this.currentPlayer !== 0) {
            const colors = ["red", "yellow", "green", "blue"];
            const chosenColor =
              colors[Math.floor(Math.random() * colors.length)];
            card.color = chosenColor;
          } else {
            // For human players, you need to implement color selection logic
            // For now, default to red
            card.color = "red";
          }

          if (card.value === "wildDrawFour") {
            this.startNextTurn();
            this.players[this.currentPlayer].push(
              this.drawPile.pop(),
              this.drawPile.pop(),
              this.drawPile.pop(),
              this.drawPile.pop()
            );
          }
          break;
      }
    },

    /**
     * Calculates and updates the scores for all players at the end of a hand.
     */
    calculateScores() {
      for (let i = 0; i < this.players.length; i++) {
        const handScore = calculateScore(this.players[i]);
        this.scores[i] += handScore;
      }
    },
    checkUno(playerIndex) {
      if (this.players[playerIndex].length === 1) {
        this.unoCallPending = true;
      } else {
        this.unoCallPending = false;
      }
    },
    /**
     * Resets the store for a new game.
     */
    $reset() {
      this.players = [];
      this.drawPile = [];
      this.discardPile = [];
      this.currentPlayer = 0;
      this.direction = 1;
      this.scores = {};
      this.unoCallPending = false;
      this.botTypes = [];
    },
  },
});
