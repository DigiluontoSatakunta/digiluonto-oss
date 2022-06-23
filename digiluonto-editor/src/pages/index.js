import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import ResponsiveAppBar from "../components/header";
import { Auth } from "../components/auth";
import { useUser } from "../hooks/user";
import { SnackbarProvider } from "notistack";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import styles from "../../styles/Home.module.css";

export default function Home() {
  const [showHelp, setShowHelp] = useState(true);

  const { user } = useUser();

  const MapWithNoSSR = dynamic(() => import("../components/map"), {
    ssr: false,
  });

  return (
    <Auth>
      {!user ? null : (
        <>
          <Head>
            <title>DIGILUONTO</title>
            <meta name="description" content="DIGILUONTO @ TUNI.FI" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <ResponsiveAppBar showHelp={showHelp} setShowHelp={setShowHelp} />

          <main className={styles.main}>
            <SnackbarProvider
              anchorOrigin={{
                vertical: innerWidth < 900 ? "top" : "bottom",
                horizontal: innerWidth < 900 ? "right" : "left",
              }}
              maxSnack={4}
            >
              <MapWithNoSSR showHelp={showHelp} />
            </SnackbarProvider>
          </main>
        </>
      )}
    </Auth>
  );
}
