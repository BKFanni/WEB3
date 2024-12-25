"use client"
import { createGame } from '@/app/api/game/game-actions'
import React from 'react'

type Params = {
    playerIdHex: string
}

const CreateGameButton: React.FC<Params> = ({playerIdHex}) => {
	const handleClick = async () => {
		const gameName = prompt("Enter game name")
		if (gameName === null || gameName.length < 1) {
			alert("Game name must be at least 1 character!")
			return
		}

		const username = prompt("Enter your player name")
		if (username === null || username.length < 1) {
			alert("Your player name must be at least 1 character!")
			return
		}

		const success = await createGame(gameName, playerIdHex, username)
		if (!success)
			alert("Failed to create a game!")
	}

	return (
		<button onClick={handleClick}>Create New Game</button>
	)
}

export default CreateGameButton
