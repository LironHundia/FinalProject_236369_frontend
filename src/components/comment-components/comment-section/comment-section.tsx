import React from 'react';
import { Box } from '@mui/material';
import { Loader } from '../../loader/loader';
import { EventApi } from '../../../api/eventApi';
import { ErrorMessage } from '../../error/error';
import { CommentProps } from '../../../types'
import { Comment } from '../comment/comment'
import { CommentAddNew } from '../comment-add-new/comment-add-new';
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
    const [newComment, setNewCommet] = React.useState<boolean>(true);

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
        const fetchComments = async () => {
            try {
                setIsLoading(true);
                if (eventId && newComment) {
                    const comments = await EventApi.getEventComments({ eventId, page: commentPage });
                    setComments(comments);
                    setNewCommet(false);
                }
            } catch (e) {
                setErrorMessage('Failed to load comments due to server error. please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [eventId, newComment]);

    return (
        <Box className="commentsSectionContainer">
            <CommentAddNew setNewComment={setNewCommet} />
            <Box className="commentsContainer">
                {isLoading && <Loader />}
                {errorMessage && <ErrorMessage message={errorMessage} />}
                {!errorMessage && commentCount === 0 && <h2>No comments yet</h2>}
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
