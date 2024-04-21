import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';  
import './invalid-action-msg.scss';


interface InvalidActionMsgProps {
    msg: string;
    goToCatalog: () => void;
}

export const InvalidActionMsg: React.FC<InvalidActionMsgProps> = ({msg, goToCatalog}) => {

    return (
        <Box>
            <Popper open={true} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} placement='bottom'>
                <Box className="invalidActionMsg" sx={{border: '1px solid', p: 1, bgcolor: 'background.paper'}}>
                    <Typography>{msg}</Typography>
                    <button onClick={goToCatalog}>Go to Catalog</button>
                </Box>
            </Popper>
        </Box>
    );
}
