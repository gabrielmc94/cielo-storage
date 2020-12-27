import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api from './util/api';
import { cleanFileName } from './util/cleanFileName';

const FileContext = createContext();

export const useFileContext = () => useContext(FileContext);

const FileContextProvider = ({ children }) => {
    const { getAccessTokenSilently } = useAuth0();
    const [files, setFiles] = useState();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [prefix, setPrefix] = useState();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [toast, setToast] = useState({
        open: false,
        message: ""
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        variant: "success"
    });

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbar(s => ({ ...s, open: false }));
    };

    useEffect(() => {
        try {
            _getFiles()
        } catch (err) {
            console.log(err);
        }
        // eslint-disable-next-line
    }, [prefix]);

    const _getFiles = async () => { // TODO: handle errors
        let token = await getAccessTokenSilently();
        setFiles();

        let url = `/files`;
        if (prefix) {
            url += `?prefix=${prefix}`;
        }

        let apiResponse = await api.get(url, { headers: { authorization: `Bearer ${token}` } });
        setFiles(apiResponse.data);
    }

    const goBack = () => {
        // TODO: just go back one level
        setPrefix();
    }

    const selectFiles = (fileName) => {
        if (selectedFiles[0] === fileName) {
            setSelectedFiles([])
        } else {
            setSelectedFiles([fileName]);
        }

        // TODO: use this when we can handle multiple files
        // setSelectedFiles(prev => {
        //     if (prev.includes(fileName)) {
        //         let index = prev.indexOf(fileName);
        //         let updated = JSON.parse(JSON.stringify(prev));
        //         updated.splice(index, 1);
        //         return updated;
        //     }
        //     return [...prev, fileName]
        // });
    }

    const downloadSelectedFiles = async () => {
        let token = await getAccessTokenSilently(); // TODO: check error handling
        let fileNames = `[${selectedFiles.map(f => `"${f}"`).join(", ")}]`;

        let res = await api.get(`/download?fileNames=${fileNames}`, {
            headers: {
                authorization: `Bearer ${token}`
            },
            responseType: "arraybuffer"
        });

        let blob = new Blob([res.data]);

        // TODO: handle older browsers
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        let fileName = cleanFileName(selectedFiles[0], prefix); // TODO: handle multiple
        link.download = fileName;
        document.body.append(link);
        link.click();
        document.body.removeChild(link);
        return;
    }

    const upload = async (formData) => {
        try {
            let token = await getAccessTokenSilently();
            setToast({open: true, message: "Uploading Files" });

            if (prefix) {
                formData.append('prefix', prefix);
            }

            let res = await api.post('/upload', formData, {
                headers: {
                    authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });

            setFiles(res.data);
            setToast(t => ({ ...t, open: false }));
            setSnackbar({  open: true, variant: "success", message: "Files Uploaded Successfully." });
        } catch (err) {
            console.log(err);
            setToast(t => ({ ...t, open: false }));
            setSnackbar({ open: true, variant: "error", message: "Error Uploading Files." });
        }
    }

    const deleteFiles = async () => {
        setToast(t => ({ ...t, open: true, message: "Deleting Files" }));
        setDeleteDialogOpen(false);

        try {
            let token = await getAccessTokenSilently();
            let res = await api.delete('/', { 
                headers: {
                    authorization: `Bearer ${token}`
                },
                data: { blobNames: selectedFiles, prefix } 
            });
            setFiles(res.data);
            setToast(t => ({ ...t, open: false }));
            setSnackbar({ open: true, variant: "success", message: "Files Deleted Successfully." });
        } catch (err) {
            console.log(err);
            setSnackbar({ open: true, variant: "error", message: "Error Deleting Files." });
            setToast(t => ({ ...t, open: false }));
        }
    }

    const value = {
        files,
        prefix,
        selectedFiles,
        toast,
        snackbar,
        deleteDialogOpen,
        closeDeleteDialog: () => setDeleteDialogOpen(false),
        setPrefix: (p) => setPrefix(p),
        goBack: () => goBack(),
        selectFiles: (fileName) => selectFiles(fileName),
        deleteFiles: () => deleteFiles(),
        downloadSelectedFiles: () => downloadSelectedFiles(),
        upload: (formData) => upload(formData),
        handleSnackbarClose: (event, reason) => handleSnackbarClose(event, reason),
        openDeleteDialog: () => setDeleteDialogOpen(true)
    };

    return (
        <FileContext.Provider value={value}>
            {children}
        </FileContext.Provider>
    )
}

export default FileContextProvider;