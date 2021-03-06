import React,{ useContext, useState, useEffect } from 'react';
import ReactStars from "react-rating-stars-component";
import { Modal } from '../../components/Modal/Modal.js';
import { AuthContext } from '../auth/AuthContext.js';
import { useModal } from '../../components/Modal/useModal.js';
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
    }, [db, worker.workerid] );

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
            const time = new Date().getUTCMilliseconds();
            const date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            
            await db.collection("reviewsCollection").add({   
                id: Math.random() + time,
                user: user.uid,
                userName: user.displayName,
                workerid:  worker.workerid,
                review: workerReview,
                rating: workerRating,
                date: date,
                time: time,
            })
            .then(() => {handleRatingUpdate() })
            .then(() => { showAddedWorked() } )
            .then(() => [] );
            //e.target[0].value = "";
        } catch(error) {
            console.warn("Error adding review: ", error);
        };
    }

    async function handleRatingUpdate() {
        var updatedRating = 0;
        reviews.forEach(function (rev){
            updatedRating += rev.rating;
        });

        updatedRating = updatedRating/reviews.length;

        db.collection("workersCollection")
        .onSnapshot(documents => {
            documents.forEach(document => {
                if(document.data().workerid === worker.workerid){
                    db.collection("workersCollection").doc(document.id).update({
                        rating: updatedRating
                    })
                }
            })
        });

        workerRating = updatedRating;
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
                    { isAuthenticated ?
                        <form onSubmit={handleSubmit} autoComplete="off" > 
                            <div id="worker-review">
                                <label>Recenzie: </label>
                                <textarea id="review" className="form-control form-review" placeholder="Recenzie" rows="5" onChange={updateReviewValue} disabled={!isEditable} defaultValue={workerReview}/>
                                <button className="btn btn-primary worker-btn" disabled={!isEditable}>Adaug?? recenzie</button>
                            </div>
                        </form> : null
                    }
                    <div id="worker-reviews">
                        <label>Reviews:</label>
                        <div> {reviews.map( rev => {return <p key={rev.time} className="review-line"><em>{rev.userName != null? rev.userName: "Anonim"}: {rev.review} - <b>{rev.rating}/5</b></em>???</p>})}</div>
                    </div>
                </Modal>
            </React.Fragment>
        </div>
    );
}
