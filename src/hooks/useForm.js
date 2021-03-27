import {useState, useEffect } from 'react';

export default function useForm(initialValues) {
    const [values, setValues] = useState(initialValues);

    useEffect(() => {
        if(initialValues){
            setValues(initialValues);
        }
    },[initialValues])

    function handleInputChange(e){
        setValues({...values, [e.target.name]: e.target.value})
    }

    function bindInput(name){
        return {
            name,
            onChange: handleInputChange,
            value: values?.[name] ?? ''
        }
    }

    return {
        values, 
        handleInputChange,
        bindInput
    };
}

