import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Loader } from '../../loader/loader';
import { Order } from '../../../types';
import { EventApi } from '../../../api/eventApi';
import { GeneralContext } from '../../main/main-page';
import { UserOrderHeader } from '../user-order-header/user-order-header';
import InfiniteScroll from 'react-infinite-scroll-component';
import './user-orders-section.scss';

export const UserOrdersSection: React.FC = () => {
    const generalContext = React.useContext(GeneralContext);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [hasMoreOrders, setHasMoreOrders] = React.useState(true);
    const [page, setPage] = React.useState(1); // State to keep track of the page number for the infinite scroll

    const fetchOrders = async () => {
        // replace with your actual fetch function
        if (!generalContext?.username) {
            return; // return early if username is not set
        }
        const newItems = await EventApi.getUserOrders(generalContext?.username!, 5, page);
        setPage(page + 1);
        setOrders([...orders, ...newItems]);
        if (newItems.length === 0 || newItems.length < 5) {
            setHasMoreOrders(false);
        }
    };

    React.useEffect(() => {
        if (hasMoreOrders) {
            fetchOrders();
        }
    }, [generalContext?.username]);

    return (
        <InfiniteScroll
            dataLength={orders.length}
            next={fetchOrders}
            hasMore={hasMoreOrders}
            loader={
            <Box>
                <Loader/>
                <h4>Loading...</h4>
            </Box>}
            endMessage={
                <Box className="no-orders">
                    <Typography className="no-orders-text"> - No orders to present -</Typography>
                </Box>
            }
        >
            {orders.map((order, index) => (
                <UserOrderHeader key={index} {...order} />
            ))}
        </InfiniteScroll>
    );
}
