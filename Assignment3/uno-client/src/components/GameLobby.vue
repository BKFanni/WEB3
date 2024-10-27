<template>
  <div>
    <h2>Available Games</h2>
    <ul>
      <li v-for="game in games" :key="game.id">
        {{ game.name }} (Players: {{ game.players.length }}/{{ game.maxPlayers }})
        <button @click="joinGame(game.id)">Join</button>
      </li>
    </ul>
    <button @click="createGame">Create New Game</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      games: [],
    };
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      this.$socket.on('gamesUpdate', (games) => {
        this.games = Object.values(games);
      });
    }
  },
  methods: {
    createGame() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to create a game');
    this.$router.push('/login');
    return;
  }

  const playerName = prompt('Enter your name');
  
  // Emit the createGame event with the player's name and token
  this.$socket.emit('createGame', { playerName, token }, (gameId) => {
    if (gameId) {
      this.$router.push(`/game/${gameId}`);
    } else {
      alert('Failed to create game');
    }
  });
},

joinGame(gameId) {
  let token = localStorage.getItem('token');
  token = token ? token.trim() : null; // Ensure token is trimmed of whitespace
  console.log('Retrieved token for joining game:', token); // Debug log
  if (!token) {
    alert('You must be logged in to join a game');
    this.$router.push('/login');
    return;
  }

  const playerName = prompt('Enter your name');
  console.log('Emitting joinGame event with:', { gameId, playerName, token }); // Debug log

  // Emit the joinGame event with the game ID, player's name, and token
  this.$socket.emit('joinGame', { gameId, playerName, token }, (response) => {
    if (response) {
      console.log('Joined game successfully');
    } else {
      alert('Failed to join game');
    }
  });
}
  }
};
</script>

