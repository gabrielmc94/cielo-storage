import React, { createRef, useState } from 'react';
import { Dialog, DialogActions, DialogContent, Typography, Button, makeStyles, IconButton } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Image, Folder, CloudUpload, InsertDriveFile, Close } from '@material-ui/icons';
import { useFileContext } from '../FileContext';

const useStyles = makeStyles(theme => ({
    emptyUploadArea: {
        height: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: grey[100],
        border: `1px solid ${grey[400]}`,
        borderRadius: 4
    },
    fileUploadArea: {
        display: "flex",
        flexWrap: "wrap"
    },
    fileCard: {
        width: 150,
        height: 150,
        padding: "8px 10px",
        border: `1px solid ${grey[400]}`,
        margin: 10,
        borderRadius: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    addFileCard: {
        color: "#39a3e9",
        width: 150,
        height: 150,
        padding: 10,
        border: '1px solid #39a3e9',
        margin: 10,
        borderRadius: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        '&:hover': {
            fontWeight: "bold !important",
            borderWidth: 3
        }
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
    }
}))

const UploadFiles = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const fileInput = createRef();
    const { upload, files } = useFileContext();

    const close = () => {
        setUploadFiles([]);
        setOpen(false);
    }

    const getIcon = (file) => {
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

        if (file.name.includes(".jpg") || file.name.includes(".jpeg") || file.name.includes(".png")) {
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

    const handleFilesChange = (e) => {
        let filesToAdd = Array.from(e.target.files);
        if (!filesToAdd.length) return;

        setUploadFiles(f => ([...f, ...filesToAdd]));
    }

    const openFileInput = () => {
        fileInput.current.click();
    }

    const removeFile = (index) => {
        let copy = Array.from(uploadFiles);
        copy.splice(index, 1);
        setUploadFiles(copy);
    }

    const submit = async () => {
        let formData = new FormData();
        setOpen(false);

        for (const file of uploadFiles) {
            formData.append("uploadFiles", file, file.name)
        }

        upload(formData);
        setUploadFiles([]);
    }

    const duplicateFiles = uploadFiles.filter(up => files.some(f => f.name.includes(up.name)));

    return (
        <>
            <Button onClick={() => setOpen(true)} color="primary" size="small" startIcon={<CloudUpload />}>
                {"Upload"}
            </Button>

            <Dialog open={open} fullWidth maxWidth="md" onBackdropClick={close}>
                <DialogContent>
                    <Typography variant="h5" gutterBottom style={{ paddingTop: 10, paddingLeft: 10, color: "dimgray" }}>{"Select Files to Upload"}</Typography>

                    {duplicateFiles.length > 0 && (
                        <div style={{ paddingLeft: 10 }}>
                            {duplicateFiles.map((file, i) => (
                                <Typography key={i} variant="subtitle1" style={{ color: "red" }}>
                                    {`A file with the name "${file.name}" already exists and will be overwritten.`}
                                </Typography>
                            ))}
                        </div>
                    )}

                    <input
                        ref={fileInput}
                        type="file"
                        style={{ display: "none" }}
                        multiple
                        onChange={handleFilesChange}
                        accept="image/*,.pdf,.doc,.docx"
                    />

                    <div className={classes.fileUploadArea}>
                        {uploadFiles.map((file, i) => (
                            <div key={i} className={classes.fileCard}>
                                <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginTop: -10 }}>
                                    <IconButton style={{ padding: 5, color: "red" }} onClick={() => removeFile(i)}>
                                        <Close style={{ fontSize: 14 }} />
                                    </IconButton>
                                </div>
                                {getIcon(file)}
                                {/* {file.kind === "prefix" && <Folder style={{ fontSize: 50, marginBottom: 10 }} />}
                                {file.kind !== "prefix" && <Image style={{ fontSize: 50, marginBottom: 10 }} />} */}
                                {/* TODO: figure out second line of text */}
                                <Typography align="center" style={{ fontSize: 14, lineHeight: "1.5em", width: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</Typography>
                            </div>
                        ))}
                        <div className={classes.addFileCard} onClick={openFileInput}>
                            <p style={{ fontSize: 40, lineHeight: "40px", margin: 0 }}>+</p>
                            <p>{"Add File"}</p>
                        </div>
                    </div>

                </DialogContent>
                <DialogActions >
                    <Button color="primary" onClick={close}>Cancel</Button>
                    <Button color="primary" onClick={submit} disabled={uploadFiles.length < 1}>Upload</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UploadFiles;