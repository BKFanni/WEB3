"use client"
import React, { useEffect, useState } from 'react'
import "@/app/game/[id]/game-style.css"
import { SessionPayload } from '@/app/api/auth/session'
import { checkPlayersTurn, drawCard } from '@/app/api/game/game-actions'
import { isError, sleep } from '@/app/models/utils'

type Params = {
    gameId: string
    session: SessionPayload
}

const DrawCardButton: React.FC<Params> = ({gameId, session}) => {
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

        const cardDrawn = await drawCard(gameId, session.sessionToEncrypt)
        if (cardDrawn)
            setPlayerTurn({
                turn: false,
                lastFetch: new Date()
            })
    }

    return (
        <button className="draw-card-button" onClick={handleClick} disabled={!playersTurn.turn}>Draw Card</button>
    )
}

export default DrawCardButton
