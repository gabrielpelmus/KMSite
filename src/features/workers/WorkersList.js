import React from 'react'
import Worker from './Worker';

export default function WorkersList( {workers, dismissModal, showDelete}) {  
    if(!workers) {
        return <h1>Nu au fost adaugati maistri ...</h1>;
    }

    return (
        <>
            <dl>
                <div className="workers">
                { workers.map(item => <Worker key={item.workerid} worker={item} dismissModal={dismissModal} showDelete={showDelete}/>) }
                </div>
            </dl>
        </>
    );
}