import React, { createRef, useState } from 'react';
import { Dialog, DialogActions, DialogContent, Typography, Button, makeStyles, IconButton, TextField } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Close, Add } from '@material-ui/icons';
import { useFileContext } from '../FileContext';
import { getIcon } from '../util/getIcon';
import { cleanFileName } from '../util/cleanFileName';

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
    addFileCardError: {
        color: "red",
        width: 150,
        height: 150,
        padding: 10,
        border: '1px solid red',
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

const NewFolderDialog = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [folderName, setFolderName] = useState("");
    const [fileError, setFileError] = useState(false);
    const [folderNameError, setFolderNameError] = useState(false);
    const fileInput = createRef();
    const { upload, files, prefix } = useFileContext();

    const close = () => {
        setFolderName("");
        setFolderNameError(false);
        setFileError(false);
        setUploadFiles([]);
        setOpen(false);
    }

    const handleFilesChange = (e) => {
        let filesToAdd = Array.from(e.target.files);
        if (!filesToAdd.length) return;

        setUploadFiles(f => ([...f, ...filesToAdd]));
        setFileError(false);
    }

    const handleFolderNameChange = (e) => {
        setFolderName(e.target.value);
        setFolderNameError(false);
    }

    const openFileInput = () => {
        fileInput.current.click();
    }

    const removeFile = (index) => {
        let copy = Array.from(uploadFiles);
        copy.splice(index, 1);
        setUploadFiles(copy);
    }

    const submit = async (e) => {
        e.preventDefault();

        if (files.some(f => f.kind === "prefix" && cleanFileName(f.name, prefix) === folderName)) {
            setFolderNameError(true);
            return;
        }

        if (uploadFiles.length < 1) {
            setFileError(true);
            return;
        }

        setOpen(false);
        setFolderName("");
        setFileError(false);
        let formData = new FormData();
        formData.append("newFolderName", folderName);

        for (const file of uploadFiles) {
            formData.append("uploadFiles", file, file.name)
        }

        upload(formData);
        setUploadFiles([]);
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} color="primary" size="small" style={{ marginLeft: 10 }} startIcon={<Add />}>
                {"Folder"}
            </Button>

            <Dialog open={open} fullWidth maxWidth="md" onBackdropClick={close}>
                <form onSubmit={submit}>
                    <DialogContent>
                        <div style={{ padding: 10, borderRadius: 4, display: "flex", alignItems: "center" }}>
                            <Typography variant="h5" gutterBottom color="primary" style={{ marginBottom: 0 }}>{"New Folder"}</Typography>
                        </div>

                        <Typography gutterBottom style={{ paddingLeft: 10, color: "dimgray" }}>
                            {"Give the new folder a name:"}
                        </Typography>

                        <div style={{ padding: 10, paddingTop: 0 }}>
                            {folderNameError && (
                                <Typography variant="subtitle1" style={{ color: "red" }}>
                                    {`A folder with that name already exists.`}
                                </Typography>
                            )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                            <Typography style={{ display: "inline-block", fontSize: 17 }}>{prefix}</Typography>
                            <TextField
                                variant="outlined"
                                size="small"
                                style={prefix ? { marginLeft: 5 } : {}}
                                value={folderName}
                                onChange={handleFolderNameChange}
                                required
                            />
                        </div>

                        <Typography gutterBottom style={{ paddingLeft: 10, marginBottom: 10, color: "dimgray", fontSize: 16 }}>
                            {"In order for a folder to exist, it must contain at least one file. Add any files you wish to be contained in the new folder:"}
                        </Typography>

                        {fileError && (
                            <div style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
                                <Typography variant="subtitle1" style={{ color: "red" }}>
                                    {`At least one file is required`}
                                </Typography>
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
                                    <Typography align="center" style={{ fontSize: 14, lineHeight: "1.5em", width: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</Typography>
                                </div>
                            ))}
                            <div className={fileError ? classes.addFileCardError : classes.addFileCard} onClick={openFileInput}>
                                <p style={{ fontSize: 40, lineHeight: "40px", margin: 0 }}>+</p>
                                <p>{"Add File"}</p>
                            </div>
                        </div>

                    </DialogContent>
                    <DialogActions >
                        <Button color="primary" onClick={close}>Cancel</Button>
                        <Button color="primary" type="submit">Upload</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default NewFolderDialog;