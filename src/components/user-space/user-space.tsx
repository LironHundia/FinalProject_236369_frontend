import React from 'react';
import { GeneralContext } from '../main/main-page';
import { Box, Typography } from '@mui/material';
import { UserBar } from '../user-bar/user-bar';
import { UserOrdersSection } from '../user-orders-components/user-orders-section/user-orders-section';
import './user-space.scss';

export const UserSpace: React.FC = () => {
    const generalContext = React.useContext(GeneralContext);

    //userSpace
    return (
        <Box className='userSpacePage'>
            <UserBar onGoBack={generalContext?.changeUserSpace}/>
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
