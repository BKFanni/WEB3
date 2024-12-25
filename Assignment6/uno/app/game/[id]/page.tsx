import React from "react"
import "./game-style.css"
import { getSession } from "@/app/api/auth/session"
import { redirect } from "next/navigation"
import GameDisplay from "@/app/components/game-page/GameDisplay"
import HandDisplay from "@/app/components/game-page/HandDisplay"
import DrawCardButton from "@/app/components/game-page/DrawCardButton"

export default async function GamePage(
    {params,}: {params: Promise<{ id: string }>}
) {
    // Redirecting if not logged in
    const session = await getSession()
    if (session === undefined)
        redirect("/login")

    const gameId = (await params).id

    return (
        <div className="game-container">
            <h2>Game Room: { gameId }</h2>
            <GameDisplay
                gameId={gameId}
            />
            <HandDisplay
                gameId={ gameId }
                session={session}
            />

            <DrawCardButton
                gameId={ gameId }
                session={session}
            />
        </div>
    )
}