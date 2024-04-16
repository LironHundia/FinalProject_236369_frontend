import React from 'react';
import {UserPageProps} from '../../../types';
import { GeneralContext } from '../../main/main-page';
import { Box, Typography } from '@mui/material';
import { UserBar } from '../../user-bar/user-bar';
import { UserOrdersSection } from '../../user-orders-components/user-orders-section/user-orders-section';
import './user-space.scss';

interface UserSpaceProps {
    navigation: UserPageProps;
    previousUserPage?: 'catalog' | 'eventPage' | 'payment';
    previousBOPage?: 'catalog' | 'eventPage' | 'createEvent';
}

export const UserSpace: React.FC<UserSpaceProps> = (props) => {
    const generalContext = React.useContext(GeneralContext);

    //userSpace
    return (
        <Box className='userSpacePage'>
            <UserBar onGoBack={props.navigation.navigateToCatalogPage} />
            <Box className="userSpaceSection">
                <Box className="usernameSection">
                    <Typography className="Textheader">Username:</Typography>
                    <Typography className="usernameText">{generalContext?.username}</Typography>
                </Box>
                <Box className="orderSection">
                    <Typography className="Textheader">Your Orders:</Typography>
                    <UserOrdersSection />
                </Box>
            </Box>
        </Box>
    )
};
