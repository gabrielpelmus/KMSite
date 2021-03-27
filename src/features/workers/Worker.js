import React,{ useContext } from 'react';
import ReactStars from "react-rating-stars-component";
import { Modal } from '../../components/Modal/Modal.js';
import { AuthContext } from '../auth/AuthContext.js';
import { useModal } from '../../components/Modal/useModal.js';
import * as firebase from 'firebase/app';

export default function Worker({ worker, dismissModal, showDelete = false }) {
    const { isAuthenticated } = useContext(AuthContext);
    const { modalProps, openModal } = useModal();
    const styling = {
        size: 30,
        isHalf: true,
        onChange: newValue => {
            console.log(`The new value is ${newValue}`);
        } 
    };

    function showDetails() {
        if (!dismissModal) {
            openModal();
        }
    }

    async function handleDelete() {

        await firebase.firestore().collection('workersCollection').onSnapshot(documents => {
            documents.forEach(document => {
                console.log(document.data().workerid)
                if (document.data().workerid === worker.workerid) {
                    firebase.firestore().collection('workersCollection').doc(document.id).delete();
                    alert('Anuntul a fost sters cu success!')
                }
            })

        });
    }

    return (
        <div className="card">
            <React.Fragment key={worker.id} >
                <div className="card-header">
                    <h2>{worker.name}</h2>
                </div>
                <div className="card-body">
                    <div className="">
                        <label className=""> Adaugat la: </label> {worker.time}  {worker.date}
                    </div>
                    <div className="">
                        <label className=""> Specializare: </label> {worker.specialization}
                    </div>
                    <div className="">
                        <label className=""> Localitate: </label> {worker.location}
                    </div>
                </div>
                <div className="card-btn">
                    {dismissModal ?
                        null : <button className="btn btn-primary worker-btn" onClick={showDetails}>Detalii</button>
                    }
                    {/* { showEdit ?
                        <button className="btn btn-primary worker-btn" onClick={handleEdit}>Editare</button> : null
                    } */}
                    {showDelete ?
                        <button className="btn btn-primary worker-btn" onClick={handleDelete}>Stergere</button> : null
                    }
                </div>
                <Modal {...modalProps} title={worker.name} >
                    <div className="worker-details">
                        <label className=""> Specializare: </label> {worker.specialization}
                    </div>
                    < div className="worker-details">
                        <label className=""> Localitate: </label> {worker.location}
                    </div>
                    < div className="worker-details">
                        <label className=""> Telefon: </label>  {worker.phoneNumber}
                    </div>
                    <div className="worker-details">
                        <label className=""> Descriere: </label> {worker.description}
                    </div>
                    <div id="rating">
                        <label>Rating: </label> <ReactStars {...styling} value={worker.rating} edit={isAuthenticated}/>
                    </div>
                </Modal>
            </React.Fragment>
        </div>
    );
}
