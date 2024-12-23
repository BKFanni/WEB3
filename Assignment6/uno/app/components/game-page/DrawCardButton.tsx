"use client"
import React from 'react'

import "@/app/game/game-style.css"
import { SessionPayload } from '@/app/api/auth/session'
import { drawCard } from '@/app/api/game/game-actions'

type Params = {
    gameId: string
    session: SessionPayload
}

const DrawCardButton: React.FC<Params> = ({gameId, session}) => {
    const handleClick = () => {
        drawCard(gameId, session.sessionToEncrypt)
    }

    return (
        <button className="draw-card-button" onClick={handleClick}>Draw Card</button>
    )
}

export default DrawCardButton
