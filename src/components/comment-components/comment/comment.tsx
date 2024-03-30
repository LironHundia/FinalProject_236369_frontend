import React from 'react';
import { Box } from '@mui/material';
import { dateToString } from '../../../utilities';
import './comment.scss';
import { CommentProps } from '../../../types';


export const Comment: React.FC<CommentProps> = ({ author, comment, date }) => {
    const modifiedDate = new Date(date);
    const formattedDate = dateToString(modifiedDate);
    return (
        <Box className="comment">
            <Box className="header">
                <Box className="author">{author}</Box>
                <Box className="date">{formattedDate}</Box>
            </Box>
            <Box className="content">{comment}</Box>
        </Box>
    );
};