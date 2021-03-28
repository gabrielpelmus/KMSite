import React,{ useContext, useState, useEffect } from 'react';
import ReactStars from "react-rating-stars-component";
import { Modal } from '../../components/Modal/Modal.js';
import { AuthContext } from '../auth/AuthContext.js';
import { useModal } from '../../components/Modal/useModal.js';
import { useForm } from '../../hooks';
import * as firebase from 'firebase/app';

export default function Worker({ worker, dismissModal, showDelete = false }) {
    const initialFormValues = {value: ''};
    const [ , setItem ] = useState(initialFormValues);
    const [ reviews, setReview] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    //const { values, bindInput } = useForm(initialFormValues);
    const { modalProps, openModal } = useModal();
    var isEditable = isAuthenticated;
    var workerRating = worker.rating;
    var workerReview = "";
    const styling = {
        size: 30,
        isHalf: true,
        edit: isEditable,
        onChange: newValue => {
            workerRating = newValue;
        } 
    };

    const db = firebase.firestore();
    useEffect(() => {
        let subscribe = null;
        if(user) {
            subscribe = db.collection("reviewsCollection")
                .where("user", "==", user.uid)
                .onSnapshot((docs) => {
                    const newReview = [];
                    docs.forEach((doc) => {
                        const review = {...doc.data(), id: doc.id}
                        newReview.push(review);
                    });
                    setItem(newReview);
                });   
        }  
        return () => subscribe; //Unsubscribe
    }, [db, user]);

    function showDetails() {
        if (!dismissModal) {
            openModal();
        }
    }

    useEffect(() => {
       db.collection("reviewsCollection")
            .where("workerid","==", worker.workerid)
            .onSnapshot( snapshot =>{
              setReview(snapshot.docs.map(doc => doc.data()));
            });  
    }, [] );

    // function resetValue() {
    //     values.review = "";
    //     values.rating = 0;
    // }

    function showAddedWorked(){
        //resetValue();
        isEditable = false;
    }

    function updateReviewValue(e){
        workerReview = e.target.value;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            const time = new Date().getHours() + ":" +  new Date().getMinutes();
            const date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            
            await db.collection("reviewsCollection").add({   
                user: user.uid,
                workerid:  worker.workerid,
                review: workerReview,
                rating: workerRating,
                date: date,
                time: time,
            })
            .then(() => { showAddedWorked() } )
            .then(() => [] )
                            
        } catch(error) {
            console.warn("Error adding review: ", error);
        };
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
                    <div id="worker-rating">
                        <label>Rating: </label> <ReactStars {...styling} value={workerRating}/>
                    </div>
                    <div id="worker-review">
                        <label>Reviews:</label>
                        <div> {reviews.map( rev => {return <p className="review-line"><em>{rev.review} - <b>{rev.rating}/5</b></em>☆</p>})}</div>
                        
                    </div>

                    { isAuthenticated ?
                        <form onSubmit={handleSubmit} autoComplete="off" > 
                            <div id="worker-review">
                                <label>Recenzie: </label>
                                {/* <textarea className="form-control form-description" {...bindInput('review')} placeholder="Recenzie" rows="5" disabled={!isEditable}> </textarea> */}
                                <textarea id="worker-review" className="form-control form-review" placeholder="Recenzie" rows="5" onChange={updateReviewValue} disabled={!isEditable} defaultValue={workerReview}/>
                                {/* <button className="btn btn-primary worker-btn" onClick={handleReview} disabled={!isEditable}>Adaugă recenzie</button> */}
                                <button className="btn btn-primary worker-btn" disabled={!isEditable}>Adaugă recenzie</button>
                            </div>
                        </form> : null
                    }
                </Modal>
            </React.Fragment>
        </div>
    );
}
