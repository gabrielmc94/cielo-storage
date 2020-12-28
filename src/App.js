import { useState } from "react";
import {
  AppBar, CssBaseline, Divider, Drawer, Hidden, IconButton, List, ListItem, ListItemIcon,
  ListItemText, makeStyles, Toolbar, Typography, useTheme, Button, Paper, LinearProgress, Snackbar, SnackbarContent
} from "@material-ui/core";
import { Cloud, Menu, ExitToApp, Folder, CloudDownload, Check, Warning, Delete } from "@material-ui/icons";
import { useAuth0 } from '@auth0/auth0-react';
import Files from './components/Files';
import SplashScreen from "./components/SplashScreen";
import { useFileContext } from "./FileContext";
import UploadDialog from './components/UploadFiles';
import DeleteDialog from "./components/DeleteDialog";
import NewFolderDialog from "./components/NewFolderDialog";

// TODO: add new folder
// TODO: download multiple files
// TODO: filter just pictures
// TODO: show thumbnails of images


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    // [theme.breakpoints.up('sm')]: {
    //   width: `calc(100% - ${drawerWidth}px)`,
    //   marginLeft: drawerWidth,
    // },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    position: "relative",
  }
}));

const snackbarContent = (msg = "", variant = "success") => {
  let backgroundColor = variant === "success" ? "#4bbc4b" : "red";

  return (
    <SnackbarContent message={
      <div style={{ display: "flex" }}>
        {variant === "success" ? <Check style={{ marginRight: 10 }} /> : <Warning />}
        <Typography style={{ display: "inline-block" }}>{msg}</Typography>
      </div>
    } style={{ backgroundColor }} />
  )
}

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { prefix, selectedFiles, downloadSelectedFiles, toast, snackbar, handleSnackbarClose, openDeleteDialog, setPrefix } = useFileContext();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // TODO: delete origin and try again.....has .env
  // const container = window !== undefined ? () => window().document.body : undefined;

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button onClick={() => setPrefix()}>
          <ListItemIcon><Folder /></ListItemIcon>
          <ListItemText primary={"All Files"} />
        </ListItem>
        {/* <ListItem button>
          <ListItemIcon><PhotoLibrary /></ListItemIcon>
          <ListItemText primary={"Photos"} />
        </ListItem> */}
        <Divider />
        <ListItem button onClick={() => logout({ returnTo: window.location.origin })}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary={"Log Out"} />
        </ListItem>
      </List>
    </div>
  );

  if (isLoading) {
    if (!isAuthenticated) return null;
    return (
      <SplashScreen />
    );
  }

  if (!isAuthenticated) {
    return loginWithRedirect();
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Menu />
          </IconButton>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Cloud />
            <Typography variant="h6" noWrap style={{ marginLeft: 10 }}>
              {"Cielo Storage"}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="js">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <main style={{ flexGrow: 1, flexDirection: "column", display: "flex" }}>
        <div className={classes.toolbar} />

        <div style={{ borderBottom: "1px solid #c0c0c0", padding: "12px 15px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <UploadDialog />
            <NewFolderDialog/>
          </div>

          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Typography style={{ margin: 4 }}>{prefix || "All Files"}</Typography>
          </div>

          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            {selectedFiles.length > 0 && (
              <>
                <Button startIcon={<Delete/>} size="small" style={{ marginRight: 10, color: "red" }} onClick={openDeleteDialog}>{"Delete"}</Button>
                <Button startIcon={<CloudDownload />} size="small" color="primary" onClick={downloadSelectedFiles}>{`Download ${selectedFiles.length} File${selectedFiles.length > 1 ? "s" : ""}`}</Button>
              </>
            )}
          </div>
        </div>

        {/* <Grid container alignItems="center" alignContent="center" style={{ margin: 0, borderBottom: "1px solid rgba(0, 0, 0, 0.12)", borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
          <Grid container item xs={4}>
            <UploadDialog />
          </Grid>
          <Grid container item xs={4} justify="center">
            <Typography style={{ margin: 4 }}>{prefix || "All Files"}</Typography>
          </Grid>
          <Grid container item xs={4} justify="flex-end">
            {selectedFiles.length > 0 && (
              <>
                <Button startIcon={<Delete />} size="small" style={{ marginRight: 10, color: "red" }}>{"Delete"}</Button>
                <Button startIcon={<CloudDownload />} size="small" color="primary" onClick={downloadSelectedFiles}>{`Download ${selectedFiles.length} File${selectedFiles.length > 1 ? "s" : ""}`}</Button>
              </>
            )}
          </Grid>
        </Grid> */}

        <div className={classes.content}>
          <Files />

          {/********** Snackbar ***********/}
          <Snackbar
            open={snackbar.open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={handleSnackbarClose}
            autoHideDuration={snackbar.variant === "success" ? 2000 : 5000}
          >
            {snackbarContent(snackbar.message, snackbar.variant)}
          </Snackbar>

          {/********** Loading Snackbar ***********/}
          <Snackbar
            open={toast.open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Paper elevation={3} style={{
              minWidth: 300
            }}>
              <div style={{ padding: 15 }}>
                <Typography variant="h5" color="primary">
                  {toast.message}
                </Typography>
              </div>
              <LinearProgress variant="indeterminate" />
            </Paper>
          </Snackbar>

          <DeleteDialog/>
        </div>
      </main>
    </div>
  );
}

export default App;