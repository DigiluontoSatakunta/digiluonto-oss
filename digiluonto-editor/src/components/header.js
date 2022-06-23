import Head from "next/head";
import Link from "next/link";
import * as React from "react";
import {useRouter} from "next/router";
import {useApolloClient} from "@apollo/client";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Logout from "@mui/icons-material/Logout";
import LinkIcon from "@mui/icons-material/Link";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Settings from "@mui/icons-material/Settings";
import ListItemIcon from "@mui/material/ListItemIcon";
import LinearProgress from "@mui/material/LinearProgress";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ArchitectureIcon from "@mui/icons-material/Architecture";

import {useLoader} from "../hooks/loader";
import {useUser} from "../hooks/user";

import SettingsDialog from "./settings/dialog";

import styles from "../../styles/Header.module.css";

import {CLIENT_URL, GRAPHQL_API} from "../utility/definitions";

export default function ResponsiveAppBar({showHelp, setShowHelp}) {
  const {loader} = useLoader();
  const {user} = useUser();
  const router = useRouter();

  const client = useApolloClient();

  React.useEffect(() => {
    const show = localStorage.getItem("showHelp");
    // 1st time user is shown help
    setShowHelp(show === null ? true : show === "true");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once

  React.useEffect(() => {
    localStorage.setItem("showHelp", showHelp);
  }, [showHelp]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);

  const handleMenu = event => setAnchorEl(event.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const handleSettings = () => setSettingsDialogOpen(true);

  const handleSignOut = () => {
    setAnchorEl(null);
    // reset apollo
    client.resetStore();
    // remove token from local storage
    localStorage.removeItem("token");
    // redirect to login page
    router.push("/auth/signin");
  };

  const Loader = ({loader}) => {
    return loader ? (
      <LinearProgress className={styles.loader} />
    ) : (
      <div className={styles.loaderPlaceholder}></div>
    );
  };

  return (
    <>
      <Head>
        <title>{user?.group?.name} - Editori</title>
      </Head>
      <SettingsDialog
        open={settingsDialogOpen}
        setOpen={setSettingsDialogOpen}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
      />
      <AppBar position="static">
        <Loader loader={loader} />
        <Container
          style={{
            minWidth: "100vw",
            maxWidth: "100vw",
            padding: 0,
            position: "static",
          }}
        >
          <AppBar sx={{paddingLeft: 3, position: "static"}}>
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: "white",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  lineHeight: 1,
                  flexGrow: 1,
                }}
              >
                EDITORI
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  mr: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    textTransform: "capitalize",
                    lineHeight: 1.2,
                  }}
                >
                  {user?.username}
                </Typography>
                <Typography variant="body" sx={{fontSize: ".8rem"}}>
                  {user?.email}
                </Typography>
              </Box>
              {true && (
                <Box sx={{mr: 1}}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    keepMounted
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    transformOrigin={{horizontal: "right", vertical: "top"}}
                    anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleSettings}>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Asetukset
                    </MenuItem>
                    <MenuItem>
                      <Link href={CLIENT_URL}>
                        <a
                          target="_blank"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ListItemIcon>
                            <LinkIcon fontSize="small" />
                          </ListItemIcon>
                          Sovellus
                        </a>
                      </Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <Link href={GRAPHQL_API}>
                        <a
                          target="_blank"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ListItemIcon>
                            <LinkIcon fontSize="small" />
                          </ListItemIcon>
                          Strapi
                        </a>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link href="https://gpx.studio/">
                        <a
                          target="_blank"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ListItemIcon>
                            <LinkIcon fontSize="small" />
                          </ListItemIcon>
                          Gpx.studio
                        </a>
                      </Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleSignOut}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Kirjaudu ulos
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Toolbar>
          </AppBar>
        </Container>
      </AppBar>
    </>
  );
}
