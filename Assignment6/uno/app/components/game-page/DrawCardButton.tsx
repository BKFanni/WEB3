"use client"
import React, { useEffect, useState } from 'react'

import "@/app/game/game-style.css"
import { SessionPayload } from '@/app/api/auth/session'
import { checkPlayersTurn, drawCard } from '@/app/api/game/game-actions'
import { isError, sleep } from '@/app/models/utils'

type Params = {
    gameId: string
    session: SessionPayload
}

const DrawCardButton: React.FC<Params> = ({gameId, session}) => {
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

        const cardDrawn = await drawCard(gameId, session.sessionToEncrypt)
        if (cardDrawn)
            setPlayerTurn(false)
    }

    return (
        <button className="draw-card-button" onClick={handleClick} disabled={!playersTurn}>Draw Card</button>
    )
}

export default DrawCardButton
