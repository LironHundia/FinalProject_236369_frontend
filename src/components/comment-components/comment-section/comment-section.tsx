import React from 'react';
import { Box } from '@mui/material';
import { Loader } from '../../loader/loader';
import { EventApi } from '../../../api/eventApi';
import { CommentProps } from '../../../types'
import { Comment } from '../comment/comment'
import './comment-section.scss';

interface Props {
    eventId: string;
}

export const CommentSection: React.FC<Props> = ({ eventId }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [commentPage, setCommentPage] = React.useState<number>(0);
    const [comments, setComments] = React.useState<CommentProps[]>([]);
    const [commentCount, setCommentCount] = React.useState<Number>(0);

    //get the number of comments for the event
    React.useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                const count = await EventApi.getEventCommentsCount(eventId);
                setCommentCount(count);
                setErrorMessage('');
            } catch (e) {
                setErrorMessage('Failed to load comment count, please try again');
            }
        };
        fetchCommentCount();
    }, [eventId]);

    //get the comments for the event
    React.useEffect(() => {
        setIsLoading(true);
        const fetchComments = async () => {
            try {
                const comments = await EventApi.getEventComments({ eventId, page: commentPage });
                setComments(comments);
            } catch (e) {
                setErrorMessage('Failed to load comments, please try again');
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [eventId, commentPage]);

    return (
        <Box className="commentsSectionContainer">
            <Box className="commentsContainer">
                {isLoading && <Loader/>}
                {errorMessage && <h2>{errorMessage}</h2>}
                {commentCount === 0 && <h2>No comments yet</h2>}
                {commentCount !== 0 && comments.length > 0 && comments.map((comment, index) => <Comment key={index} className="commentItem" {...comment} />)}
            </Box>
            <Box className="navigationButtons">
                <button
                    className='commentPageNavigation'
                    onClick={() => setCommentPage(Number(commentPage) - 1)}
                    disabled={commentCount === 0 || commentPage === 0}
                > Previous
                </button>
                <button
                    className='commentPageNavigation'
                    onClick={() => setCommentPage(Number(commentPage) + 1)}
                    disabled={commentCount === 0 || commentPage === Math.ceil(Number(commentCount) / 10) - 1}
                > Next
                </button>
            </Box>
        </Box>
    );
};
