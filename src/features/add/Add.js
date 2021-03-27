import React, { useContext, useEffect, useState } from 'react'
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Redirect } from 'react-router-dom';
import { Modal } from '../../components/Modal/Modal.js';
import { useModal } from '../../components/Modal/useModal.js';

import { useForm } from '../../hooks';
import { AuthContext } from '../auth/AuthContext';
import Select from 'react-select';

const initialFormValues = {value: ''};

export default function Add() {
    const [ , setItem ] = useState(initialFormValues);
    const [ validationMessage, setValidationMessage ] = useState("");
    const { values, bindInput } = useForm(initialFormValues);
    const { modalProps, openModal } = useModal();
    const { user } = useContext(AuthContext);

    const db = firebase.firestore();
    useEffect(() => {
        let subscribe = null;
        if(user) {
            subscribe = db.collection("workersCollection")
                .where("user", "==", user.uid)
                .onSnapshot((docs) => {
                    const newWorkers = [];
                    docs.forEach((doc) => {
                        const worker = {...doc.data(), id: doc.id}
                        newWorkers.push(worker);
                    });
                    setItem(newWorkers);
                });   
        }  
        return () => subscribe; //Unsubscribe
    }, [db, user]);

    // function goTo() {
    //      return <Redirect to='/' />
    // }

    async function handleSubmit(e) {
        e.preventDefault();

        let validation = dataIsValid(values);
        if(validation[0]) {
            try {
                const time = new Date().getHours() + ":" +  new Date().getMinutes();
                const date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
                const workerId = user.uid + Math.random() + date + time;
                
                await db.collection("workersCollection").add({   
                    user: user.uid,
                    workerid:  workerId,
                    name: values.name,
                    specialization: values.specialization,
                    location: values.location,
                    phoneNumber: values.phoneNumber,
                    description: values.description,
                    rating: values.rating,
                    date: date,
                    time: time,
                })
                .then(() => { showAddedWorked() } )
                .then(() => [] )
                .then(() => {return <Redirect to='/' />})
                                
            } catch(error) {
                console.warn("Error adding worker: ", error);
            };
        }        
    }

    function showAddedWorked(){
        resetValue();
        setValidationMessage('Adaugarea a fost realizata cu succes.');
        openModal();
    }

    function resetValue() {
        values.name = "";
        values.specialization = "";
        values.location = "";
        values.phoneNumber = "";
        values.description = "";
        values.rating = 2.5;
    }

    function handleAdd(){
        let validation = dataIsValid(values);
        if(!validation[0]) {
            setValidationMessage(validation[1]);
            openModal();
        }
    }

    function specializationChange(event){
        if(event == null || event === undefined || !event.value){
            values.specialization = "";
        } else {
            values.specialization = event.value;
        }
    }

    function locationChange(event){
        if(event == null || event === undefined || !event.value){
            values.location = "";
        } else {
            values.location = event.value;
        }
    }

    let json = require('./Specializations.json');
    const specializations = [];
    json.constructions.forEach(specialization => { 
        specializations.push({ label: specialization, value: specialization }); 
        specializations.sort( (first, second) => first.value >second.value ? 1 : -1 );
    });

    json = require('./Cities.json');
    const localizations = [];
    json.Romania.cities.forEach(city => { 
        localizations.push({ label: city, value: city }); 
        localizations.sort( (first, second) => first.value >second.value ? 1 : -1 );
    });

    return (
        <div>
            <div className="container">         
            <h1 className="display-4">Maistru</h1>
                <form onSubmit={handleSubmit} autoComplete="off" > 
                        <div className="form-group">
                            <label className="form-label"> Nume si prenume</label>
                            <input className="form-control form-nume" {...bindInput('name')} placeholder="Nume si prenume"/>  
                        </div>
                        <div className="form-group">
                            <label className="form-label"> Specializare </label>
                            <Select isClearable className="form-specializare" options={specializations} onChange={specializationChange} placeholder = "Specializare" noOptionsMessage={()=> "Cautare..."} />
                        </div>
                        <div className="form-group">                            
                            <label className="form-label"> Localitate </label>
                            <Select isClearable className="form-localitate" options={localizations} onChange={locationChange} placeholder = "Localitate" noOptionsMessage={()=> "Cautare..."} />
                        </div>
                        <div className="form-group">
                            <label className="form-label"> Telefon </label>
                            <input className="form-control form-telefon" {...bindInput('phoneNumber')} placeholder="07123456789" type="tel"/>
                        </div>
                        <div className="form-group">
                            <label className="form-label"> Descriere</label> 
                            <textarea className="form-control form-description" {...bindInput('description')} placeholder="Descriere" rows="5"> </textarea>
                        </div>
                        <div className="form-group">
                            <input className="form-control form-rating" {...bindInput('rating')} placeholder="Rating" value="2.5"/>
                        </div>
                    <button className="btn btn-primary add-btn" onClick={handleAdd}>Adaugare</button>
                </form>

                <Modal {...modalProps} title="Adaugare maistru" >
                    <div className="form-group">
                        <label className=""> {validationMessage} </label>
                    </div>
                </Modal>

            </div>
        </div>
    )
}

function dataIsValid(values) {
    if(values === null || values === undefined) {
        return [false, "Va rugam completati campurile libere."];
    }        
    if(values.name === undefined || values.name === null || values.name.length < 3) {
        return [false, "Va rugam adaugati un nume si prenume valid."];
    }
    if(values.specialization === undefined || values.specialization === null || values.specialization === "") {
        return [false, "Va rugam adaugati o specializare valida."];
    }
    if(values.location === undefined || values.location === null || values.location === "") {
        return [false,  "Localitatea trebuie sa fie selectata."];
    }
    if(values.phoneNumber === undefined || values.phoneNumber === null || !checkPhoneNumber(values.phoneNumber)) {
        return [false, "Va rugam adaugati un numar de telefon valid."];
    }
    if(values.description === undefined || values.description === null || values.description.length < 10) {
        return [false, "Va rugam adaugati o descriere mai complexa. Minimum 10 caractere."];
    }

    return [true, ""];
}

function checkPhoneNumber(val) {
    var mob=/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    if (mob.test(val) === false) {
        return false;
    }
     if (val.length > 15) {
        return false;
    }

    return true;
}

