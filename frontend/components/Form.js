import axios from 'axios';
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'; 

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
};

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup 
    .string()
    .trim()
    .oneOf(['S','M','L'], validationErrors.sizeIncorrect),
})



const initalErrors = () => ({ 
  fullname: '', 
  size: '' 
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const initalValues = { 
  fullName: '', 
  size: '',
  toppings: []
}


export default function Form() {
  // const [fullname, setFullName] = useState('')
  const [values, setValues] = useState(initalValues)
  const [errors, setErrors] = useState(initalErrors)
  const [success, setSuccess] = useState()
  const [failure, setFailure] = useState()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    formSchema.isValid(values).then(setEnabled)
  }, [values])

  const validate = (key, value) => {
    yup
      .reach(formSchema, key)
      .validate(value)
      .then(() => {setErrors({...errors, [key]: ''}) })
      .catch((error) => { setErrors({...errors, [key]: error.errors[0] });
     });
  }

  const inputChange = evt => {
    const {id, value} = evt.target
    validate(id, value)
    setValues({...values, [id]: value})
    // if (type === 'checkbox') value = checked
    // setFullName(value)
    // setValues({...values, [name]: value})
     //console.log(values)
  }

  const onSubmit = evt => {
    // yup
    //   .reach(formSchema, name)
    //   .validate(value)
    //   .then(() => {setErrors({...errors, [name]: ''}) })
    //   .catch((error) => { setErrors({...errors, [name]: error.errors[0] });
    //  });
    evt.preventDefault()
    axios
      .post("http://localhost:9009/api/order", values)
      .then(res => {
        setValues(initalValues())
        setSuccess(res.data.message);
        setFailure();
      })
      .catch(err => {
        setFailure(err.response.data.message);
        setSuccess();
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {true && <div className='success'>{success}</div>}
      {true && <div className='failure'>{failure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullname}
          onChange={inputChange}
          placeholder="Type full name" 
          id="fullName" 
          type="text" 
        />
        </div>
        {true && <div className='error'>{errors.fullname}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select value={values.size} onChange={inputChange} id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {true && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        <label key="1">
          <input
            name="Pepperoni"
            type="checkbox"
          />
          Pepperoni<br />
        </label> 

        <label key="2">
          <input 
            name="Green Peppers"
            type="checkbox"
          />
          Green Peppers<br />
        </label>

        <label key="3">
          <input
            name="Pineapple"
            type="checkbox"
          />
          Pineapple<br />
        </label>

        <label key="4">
          <input 
            name="Mushrooms"
            type="checkbox"
          />
          Mushrooms<br />
        </label>

        <label key="5">
          <input
            name="Ham"
            type="checkbox"
          />
          Ham<br />
        </label>
        
      </div>

      

      
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!enabled} type="submit" />
    </form>
  )
}
