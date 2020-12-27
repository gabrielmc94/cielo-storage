import React from 'react';
import { makeStyles, Paper, Tooltip, Typography } from '@material-ui/core';
import { Folder, Image, InsertDriveFile } from '@material-ui/icons';
import { useFileContext } from '../FileContext';
import { cleanFileName } from '../util/cleanFileName';

const useStyles = makeStyles(theme => ({
    card: {
        border: "1px solid lightgray",
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        minWidth: 150,
        minHeight: 150,
        maxHeight: 250,
        maxWidth: 250,
        margin: 10,
        padding: 10
    },
    cardSelected: {
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        width: 150,
        height: 149,
        maxHeight: 249,
        maxWidth: 250,
        margin: 10,
        padding: 9,
        color: theme.palette.primary.main
    }
}));

const FileCard = (props) => {
    const { file } = props;
    const { setPrefix, prefix, selectFiles, selectedFiles } = useFileContext();
    const classes = useStyles();

    const getIcon = () => {
        if (file.kind === "prefix") {
            return <Folder style={{ fontSize: 70, marginBottom: 10, color: "gray" }} />
        }

        if (file.name.includes(".docx")) {
            return (
                <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ position: "absolute", color: "white", marginTop: 12 }}>.docx</div>
                    <InsertDriveFile style={{ fontSize: 70, marginBottom: 10 }} color="primary" />
                </div>
            )
        }

        if (file.name.includes(".jpg")) {
            return <Image style={{ fontSize: 70, marginBottom: 10, color: "#4bbc4b" }} />
        }

        if (file.name.includes(".txt")) {
            return (
                <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ position: "absolute", color: "white", marginTop: 12 }}>.txt</div>
                    <InsertDriveFile style={{ fontSize: 70, marginBottom: 10, color: "gray" }} />
                </div>
            )
        }

        if (file.name.includes(".pdf")) {
            return (
                <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ position: "absolute", color: "white", marginTop: 12 }}>.pdf</div>
                    <InsertDriveFile style={{ fontSize: 70, marginBottom: 10, color: "#e12828" }} />
                </div>
            )
        }
    }

    const handleClick = () => {
        if (file.kind === "prefix") return setPrefix(file.name);

        selectFiles(file.name);
    }

    return (
        <Paper
            className={selectedFiles.includes(file.name) ? classes.cardSelected : classes.card}
            onDoubleClick={() => console.log('TODO: download')}
            onClick={handleClick}
            elevation={selectedFiles.includes(file.name) ? 3 : 0}
        >
            <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
                {getIcon()}
            </div>

            <Tooltip enterDelay={1400} title={<Typography style={{ fontSize: 14 }}>{cleanFileName(file.name, prefix)}</Typography>}>
                <Typography
                    align="center"
                    style={{
                        overflow: "hidden",
                        maxWidth: 128,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        fontSize: 12
                    }}
                >
                    {cleanFileName(file.name, prefix)}
                </Typography>
            </Tooltip>
        </Paper>
    );
};

export default FileCard;