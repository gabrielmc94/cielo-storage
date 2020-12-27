import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { useFileContext } from '../FileContext';
import FileCard from './FileCard';
import { KeyboardArrowLeft } from '@material-ui/icons';

const Files = () => {
    const { files, prefix, goBack } = useFileContext();

    if (!files) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <>
            <div>
                {prefix !== undefined && (
                    <Button startIcon={<KeyboardArrowLeft />} color="primary" onClick={goBack} size="small">{"Back"}</Button>
                )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {files.map((file, i) => (
                    <FileCard key={i} file={file} />
                ))}
            </div>
        </>
    );
};

export default Files;