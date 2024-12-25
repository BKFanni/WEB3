"use client"
import React, { useEffect, useState } from 'react'
import "@/app/game/[id]/game-style.css"
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
            await sleep(250)
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
    const [cards, setCards] = useState<{
        cards: Card[]
        lastFetch: Date
    }>({cards: [], lastFetch: new Date(0)})

    useEffect(() => {
        const updateInfo = async () => {
            try {
                if (Date.now() - cards.lastFetch.getTime() < 1000)
                    await sleep(1000)

                const result = await getPlayersCards(gameId, session.sessionToEncrypt)
                setCards({
                    cards: result,
                    lastFetch: new Date()
                })
            } catch (err) {
                if (isError(err))
                    console.error("Error fetching card data!", err.message)
            }
        }

        updateInfo()
    })

    return (
        <div className="player-hand">
            <h3>Your Hand:</h3>
            <ul>
                {cards.cards.map((card) => (
                    <li key={card.cardId} className='card-container'>
                        <div className={['card', card.color].join(" ")}>Color: {card.color}, {card.value ? `Value: ${card.value}, Type: Number` : `Type: ${card.cardType}`}</div>
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
