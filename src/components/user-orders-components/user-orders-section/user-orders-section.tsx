import * as React from 'react';
import { Box, Typography } from '@mui/material';
import {Loader} from '../../loader/loader';
import {ErrorMessage} from '../../error/error';
import { Order } from '../../../types';
import { EventApi } from '../../../api/eventApi';
import {GeneralContext} from '../../main/main-page';
import { UserOrderDetails } from '../user-order-details/user-order-details';
import { UserOrderHeader } from '../user-order-header/user-order-header';
import './user-orders-section.scss';

export const UserOrdersSection: React.FC = () => {
    const generalContext = React.useContext(GeneralContext);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [orderPage, setOrderPage] = React.useState<number>(0);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [orderCount, setOrderCount] = React.useState<Number>(0);

    //get the orders of the user
    let firstOrder: Order | undefined;
    React.useEffect(() => {
        setIsLoading(true);
        const fetchOrders = async () => {
            try {
                if (!generalContext?.username) {
                    console.log("Username is not set");
                    return; // return early if username is not set
                }
                const orders = await EventApi.getUserOrders(generalContext.username, undefined, orderPage);
                setOrders(orders);
            } catch (e) {
                setErrorMessage('Failed to load comments due to server error. please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [orderPage, generalContext?.username]); // add generalContext?.username to the dependency array

    return (
        <Box>
            <Box>
                {isLoading && <Loader />}
                {errorMessage && <ErrorMessage message={errorMessage} />}
                {!errorMessage && orders.length === 0 && <h2>No More Orders</h2>}
                {orders && orders.length !== 0 && orders.map((order, index) => <UserOrderHeader key={index} {...order} />)}
               
            </Box>
            <Box className="navigationButtons">
                <button
                    className='commentPageNavigation'
                    onClick={() => setOrderPage(Number(orderPage) - 1)}
                    disabled={orders.length === 0 || orderPage === 0}
                > Previous
                </button>
                <button
                    className='commentPageNavigation'
                    onClick={() => setOrderPage(Number(orderPage) + 1)}
                > Next
                </button>
            </Box>
        </Box>
    );
}
