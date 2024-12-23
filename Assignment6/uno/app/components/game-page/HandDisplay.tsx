"use client"
import React, { useEffect, useState } from 'react'
import "@/app/game/game-style.css"
import { SessionPayload } from '@/app/api/auth/session'
import { Card } from '@/app/models/gameTypes'
import { isError } from '@/app/models/utils'
import { getPlayersCards, playCard } from '@/app/api/game/game-actions'

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
    const handleClick = () => {
        playCard(gameId, session.sessionToEncrypt, card)
    }

    return (
        <button className='play-button' onClick={handleClick}>Play</button>
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
                            {card.color} {card.value}
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
