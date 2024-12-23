"use client"
import React, { useEffect, useState } from 'react'
import "@/app/game/game-style.css"
import { SessionPayload } from '@/app/api/auth/session'
import { isError, sleep } from '@/app/models/utils'
import { checkPlayersTurn, getPlayersCards, playCard } from '@/app/api/game/game-actions'
import { Card } from '@/app/models/game/card'

type HandDisplayParams = {
    gameId: string
    session: SessionPayload
}

type PlayCardParams = {
    session: SessionPayload
    gameId: string
    card: Card
}

const PlayCardButton: React.FC<PlayCardParams> = ({session, gameId, card}) => {
    const [playersTurn, setPlayerTurn] = useState<boolean>(false)
    useEffect(() => {
        const updateInfo = async () => {
            await sleep(100)
            try {
                const result = await checkPlayersTurn(gameId, session.sessionToEncrypt)
                setPlayerTurn(result)
            } catch (err) {
                if (isError(err))
                    console.error("Error fetching game data!", err.message)
            }
        }

        updateInfo()
    }, [gameId, session.sessionToEncrypt])

    const handleClick = async () => {
        if (!playersTurn)
            return

        const cardPlayed = await playCard(gameId, session.sessionToEncrypt, card)
        if (cardPlayed)
            setPlayerTurn(false)
    }

    return (
        <button className='play-button' onClick={handleClick} disabled={!playersTurn}>Play</button>
    )
}

const HandDisplay: React.FC<HandDisplayParams> = ({gameId, session}) => {
    const [cards, setCards] = useState<Card[]>([])

    useEffect(() => {
        const updateInfo = async () => {
            try {
                const result = await getPlayersCards(gameId, session.sessionToEncrypt)
                setCards(result)
            } catch (err) {
                if (isError(err))
                    console.error("Error fetching card data!", err.message)
            }
        }

        updateInfo()
    }, [gameId, session.sessionToEncrypt])

    return (
        <div className="player-hand">
            <h3>Your Hand:</h3>
            <ul>
                {cards.map((card) => (
                    <li key={card.id} className='card-container'>
                        <div className={['card', card.color].join(" ")}>
                            {card.color} {card.value ? card.value : card.type}
                        </div>
                        <PlayCardButton
                            session={session}
                            gameId={gameId}
                            card={card}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default HandDisplay
