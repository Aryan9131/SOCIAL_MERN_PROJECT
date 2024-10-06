import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { rehydrateUser } from '../features/userSlice';

const Rehydrate = ({ children }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            dispatch(rehydrateUser(JSON.parse(storedUser)));
        }
        setLoading(false);
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>; // You can add a loading spinner here if you like
    }

    return children;
};

export default Rehydrate;
