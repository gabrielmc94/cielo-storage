import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@material-ui/core';
import { useFileContext } from '../FileContext';

const DeleteDialog = (props) => {
    const { deleteDialogOpen, closeDeleteDialog, deleteFiles } = useFileContext();

    return (
        <Dialog open={deleteDialogOpen} onBackdropClick={closeDeleteDialog}>
            <DialogContent>
                <Typography variant="h5" gutterBottom style={{ color: "red" }}>{"Delete Files"}</Typography>
                <Typography>{"The files you are about to delete will be deleted permanently and cannot be recovered. Are you sure you want to continue?"}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDeleteDialog}>{"Cancel"}</Button>
                <Button style={{ color: "red" }} onClick={deleteFiles}>{"Delete"}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;