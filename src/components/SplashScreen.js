import React from 'react';
import { LinearProgress, Typography } from '@material-ui/core';
import { Cloud } from '@material-ui/icons';

const SplashScreen = () => {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    padding: 20
                }}
            >
                <Cloud color="primary" style={{ fontSize: 60, marginRight: 15 }} />
                <Typography variant="h3" color="primary">{"Cielo Storage"}</Typography>
                <LinearProgress variant="indeterminate" style={{ width: "100%", marginTop: 15 }} color="primary"/>
            </div>
        </div>
    );
};

export default SplashScreen;