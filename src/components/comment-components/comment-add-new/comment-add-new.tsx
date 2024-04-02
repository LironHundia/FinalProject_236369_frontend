import React from 'react';
import { Button, Box, TextField, Typography, Tooltip } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { EventApi } from '../../../api/eventApi';
import { ErrorMessage } from '../../error/error';
import CancelIcon from '@mui/icons-material/Cancel';
import { GeneralContext } from '../../main/main-page';
import { UserContext } from '../../route-user/route-user';

export const CommentAddNew: React.FC = () => {
    const generalContext = React.useContext(GeneralContext);
    const userContext = React.useContext(UserContext);

    const [showInput, setShowInput] = React.useState(false);
    const [comment, setComment] = React.useState<string>('');
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const handleAddComment = () => {
        setShowInput(true);
    };

    const handleCancelComment = () => {
        setShowInput(false);
        setComment('');
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const handleSubmitComment = async () => {
        // TODO: Handle submitting the comment (e.g., send to server, update state, etc.)
        const eventId = userContext?.userEvent!._id!;
        try {
            // Send comment to server
            await EventApi.addNewComment(eventId, comment);
            setComment('');
            setShowInput(false);
        } catch (e) {
            setErrorMessage('Failed to add comment due to server error. please try again later.');
        }
        // Reset input fields
    };

    return (
        <Box>
            {!showInput ? (
                <Tooltip title="Add New Comment" placement="right" arrow>
                    <Fab color="primary" onClick={handleAddComment}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            ) : (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        {generalContext?.username!}
                    </Typography>
                    <TextField
                        placeholder="Enter your comment..."
                        value={comment}
                        onChange={handleCommentChange}
                        multiline
                        fullWidth
                        sx={{ marginBottom: 3 }}
                    />
                    <br />
                    {errorMessage && <ErrorMessage message={errorMessage} />}
                    <Button sx={{ marginRight: 1 }} onClick={handleSubmitComment} disabled={!comment.trim()} variant="contained" color="primary">
                        Submit
                    </Button>
                    <Button onClick={handleCancelComment} variant="contained" color="primary">
                        Cancel
                    </Button>
                </Box>
            )}
        </Box>
    );
};
