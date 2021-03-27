import React, { useContext } from 'react';
import WorkersPage from '../workers/WorkersPage';
import { AuthContext } from '../auth/AuthContext';

export default function UserWorkers(){
    const { user } = useContext(AuthContext);

    return(
        <>
            <WorkersPage firstItems={false} filtersActive={false} user={user} showDelete={true}></WorkersPage>
        </>
    )
}
