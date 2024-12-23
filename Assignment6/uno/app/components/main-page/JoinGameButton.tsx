"use client"
import { joinGame } from '@/app/api/game/game-actions'
import React from 'react'

type Params = {
    gameId: string,
    playerIdHex: string
}

const JoinGameButton: React.FC<Params> = ({gameId, playerIdHex}) => {
    const handleClick = async () => {
        const username = prompt("Enter your name")
        if (username === null || username.length < 1) {
            alert("Username must be at least 1 character!")
            return
        }

        await joinGame(gameId, playerIdHex, username)
    }

    return (
        <button onClick={handleClick}>Join Game</button>
    )
}

export default JoinGameButton
