import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "./api/auth/session";
import CreateGameButton from "./components/main-page/CreateGameButton";
import GameList from "./components/main-page/GameList";

export default async function Home() {
    // Redirecting if not logged in
    const session = await getSession()
    if (session === undefined)
        redirect("/login")

    return (
        <div>
            <h2>Available Games</h2>
            <GameList
                playerIdHex={session.sessionToEncrypt}
            />
            <CreateGameButton
                playerIdHex={session.sessionToEncrypt}
            />
        </div>
    );
}
