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
    const [playersTurn, setPlayerTurn] = useState<{
        turn: boolean,
        lastFetch: Date
    }>({turn: false, lastFetch: new Date(0)})
    useEffect(() => {
        const updateInfo = async () => {
            if (Date.now() - playersTurn.lastFetch.getTime() < 300)
                await sleep(300)
            
            try {
                const result = await checkPlayersTurn(gameId, session.sessionToEncrypt)
                setPlayerTurn({
                    turn: result,
                    lastFetch: new Date()
                })
            } catch (err) {
                if (isError(err))
                    console.error("Error fetching game data!", err.message)
            }
        }

        updateInfo()
    })

    const handleClick = async () => {
        if (!playersTurn)
            return

        const cardPlayed = await playCard(gameId, session.sessionToEncrypt, card)
        if (cardPlayed)
            setPlayerTurn({
                turn: false,
                lastFetch: new Date()
            })
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
            <div className="card-list">
                {cards.cards.map((card) => (
                    <div key={card.cardId} className='card-container'>
                        <div className={['card', card.color].join(" ")}>
                            Color: {card.color}, {
                                card.value !== undefined
                                ? `Value: ${card.value}, Type: Number`
                                : `Type: ${card.cardType}`
                            }
                        </div>
                        <PlayCardButton
                            session={session}
                            gameId={gameId}
                            card={card}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HandDisplay
