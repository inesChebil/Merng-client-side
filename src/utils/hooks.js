import { useState } from "react";
export const useForm=((callback,initialState={})=>{
    const [values, setValues] = useState(initialState);
    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
      };


    //   because depend on the page , the callback will be different
    const onSubmit=event=>{
        event.preventDefault();
        callback()
    }
    return{
       onChange,
       onSubmit,values 
    }
})

// const onSubmit = (event) => {
//     event.preventDefault();
//     // we won't gonna do any client validation because we already have server validation
//     // so we gonna send a mutation to the server and persist the data if the data is valid

//     //  we have to trigger addUser function when we submit our form
//     addUser();
//   };