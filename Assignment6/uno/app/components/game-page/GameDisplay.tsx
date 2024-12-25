"use client"
import { getGameInfo } from '@/app/api/game/game-actions'
import { isError, sleep } from '@/app/models/utils'
import React, { useEffect, useState } from 'react'
import "@/app/game/[id]/game-style.css"
import { Card } from '@/app/models/game/card'
import { Player } from '@/app/models/game/player'

type GameDisplayParams = {
    gameId: string
}

type PlayerTitleParams = {
    username: string
}

const PlayerTitle: React.FC<PlayerTitleParams> = ({username}) => {
    return (
        <span className='player-name'>{username}</span>
    )
}

const GameDisplay: React.FC<GameDisplayParams> = ({gameId}) => {
    // Saving a simplified version of game state
    const [gameInfo, setGameInfo] = useState<{
        id: string
        name: string
        lastCard: Card | null
        players: Player[]
        currentPlayerIndex: number
    }>()
    
    useEffect(() => {
        const updateInfo = async () => {
            if (gameInfo)
                await sleep(5000)

            try {
                const serverGameInfo = await getGameInfo(gameId)
                if (!serverGameInfo)
                    return
                
                const simplifiedInfo = {
                    id: serverGameInfo.id,
                    name: serverGameInfo.name,
                    players: serverGameInfo.players,
                    currentPlayerIndex: serverGameInfo.currentPlayerIndex,
                    lastCard: serverGameInfo.discardPile.length-1 < 0 ?
                        null
                        : serverGameInfo.discardPile[serverGameInfo.discardPile.length-1]
                }

                setGameInfo(simplifiedInfo)
            } catch (err) {
                if (isError(err))
                    console.error("Error fetching game data!", err.message)
            }
        }

        updateInfo()
    })

    return (
        <div>
            <h3>{(gameInfo && gameInfo.players.length > 1) ? <PlayerTitle username={gameInfo.players[gameInfo.currentPlayerIndex].name}/> : "Waiting for players..."}</h3>
            <div className="discard-pile">
                <p>Top of Discard Pile:</p>
                <div className={
                    ["card", gameInfo && gameInfo.lastCard ? gameInfo.lastCard.color : ""].join(" ")
                }>
                    {
                    // If no last card, display "-", else show value, if undefined display card type
                    gameInfo && gameInfo.lastCard ?
                        gameInfo.lastCard.value ? gameInfo.lastCard.value : gameInfo.lastCard.type
                    : "-" 
                    }
                </div>
            </div>
        </div>
    )
}

export default GameDisplay
