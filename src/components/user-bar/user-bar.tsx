import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { BOContext } from '../route-backoffice/route-backoffice';
import { UserContext } from '../route-user/route-user'
import { GeneralContext } from '../main/main-page';
import {hasPermission} from '../../utilities';
import * as constants from '../../consts';
import './user-bar.scss';

interface UserBarProps {
    onGoBack?: () => void;
}

export const UserBar: React.FC<UserBarProps> = ({onGoBack}) => {
    const boContext = React.useContext(BOContext);
    const userContext = React.useContext(UserContext);
    const generalContext = React.useContext(GeneralContext);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box className="userBar" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Box className="usernamePart" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 38, height: 38 }}>U</Avatar>
                        </IconButton>
                    </Tooltip>
                    <Typography sx={{ ml: 1, fontSize: '1.2em', color: 'gray' }}>{generalContext?.username}</Typography>
                </Box>
                {generalContext?.route === "user" && userContext?.nextEvent &&
                    <Typography sx={{ minWidth: 100 }}>Next Event: {userContext?.nextEvent.name} ({userContext?.nextEvent.startDate})</Typography>}
                {generalContext?.route === "backoffice" &&
                    <Button
                        variant='contained'
                        onClick={() => boContext?.navigateToBOCreateEventPage()}
                    > Add New Event
                    </Button>
                }
                <Button
                    startIcon={<ArrowBack />}
                    onClick={()=>onGoBack!()}
                    disabled={onGoBack === undefined}
                > Go Back
                </Button>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    className: "menu-paper"
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar /> Profile
                </MenuItem>
                { hasPermission(generalContext?.userPermission!,constants.MANAGER) && generalContext?.route === "user" &&
                <MenuItem onClick={() => generalContext?.setRoute(constants.BACKOFFICE)}>
                    <ListItemIcon sx={{ mr: 0.5 }}>
                        <AdminPanelSettingsOutlinedIcon fontSize="medium" />
                    </ListItemIcon>
                    Back Office
                </MenuItem>
                }
                { hasPermission(generalContext?.userPermission!,constants.MANAGER) && generalContext?.route === "backoffice" &&
                <MenuItem onClick={() => generalContext?.setRoute(constants.USER)}>
                    <ListItemIcon sx={{ mr: 0.5 }}>
                        <AdminPanelSettingsOutlinedIcon fontSize="medium" />
                    </ListItemIcon>
                    Exit Back Office
                </MenuItem>
                }
                <Divider />
                <MenuItem onClick={generalContext?.onLogout!}>
                    <ListItemIcon sx={{ mr: 0.5 }}>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

        </React.Fragment>
    );
}