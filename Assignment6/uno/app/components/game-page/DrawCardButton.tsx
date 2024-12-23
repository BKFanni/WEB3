"use client"
import React, { useEffect, useState } from 'react'

import "@/app/game/game-style.css"
import { SessionPayload } from '@/app/api/auth/session'
import { drawCard, getGameInfo } from '@/app/api/game/game-actions'
import { LimitedGameInfo } from '@/app/models/gameTypes'
import { isError, sleep } from '@/app/models/utils'

type Params = {
    gameId: string
    session: SessionPayload
}

const DrawCardButton: React.FC<Params> = ({gameId, session}) => {
    const [gameInfo, setGameInfo] = useState<LimitedGameInfo>()
    useEffect(() => {
        const updateInfo = async () => {
            try {
                const result = await getGameInfo(gameId)
                setGameInfo(result)
                await sleep(100)
            } catch (err) {
                if (isError(err))
                    console.error("Error fetching game data!", err.message)
            }
        }

        updateInfo()
    }, [gameId])

    const handleClick = () => {
        drawCard(gameId, session.sessionToEncrypt)
    }

    return (
        <button className="draw-card-button" onClick={handleClick}>Draw Card</button>
    )
}

export default DrawCardButton
