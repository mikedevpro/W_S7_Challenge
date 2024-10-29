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
    .trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup 
    .string()
    .trim()
    .oneOf(['S','M','L'], validationErrors.sizeIncorrect),
  topping: yup
    .string()
    .trim()
    .oneOf([1,2,3,4,5])
})

const initalValues = () => ({ 
  fullName: '', 
  size: '',
  toppings: []
})

const initalErrors = () => ({ 
  fullName: '', 
  size: '', 
  toppings: []
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
// const toppings= [
//    { id: '1', 
//        text: 'Pepperoni', 
//      },
//    { id: '2', 
//        text: 'Green Peppers', 
//      },
//    { id: '3', 
//        text: 'Pineapple', 
//      },
//    { id: '4', 
//        text: 'Mushrooms', 
//      },
//    { id: '5', 
//        text: 'Ham', 
//      },
//  ];

export default function Form() {
  const [values, setValues] = useState(initalValues())
  const [errors, setErrors] = useState(initalErrors())
  const [success, setSuccess] = useState('')
  const [failure, setFailure] = useState()
  const [enabled, setEnabled] = useState(false)
  // const [isChecked, setIsChecked] = useState(false);

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
    // setIsChecked(evt.target.checked);
  }

 
  const handleCheckboxChange = (evt) => {
    const { checked, name } = evt.target;
    setValues({...values, toppings: checked ? values.toppings.concat(name) : 
      values.toppings.filter(num => num != name)
    })
  }

  const onSubmit = evt => {
    evt.preventDefault();
    axios
      .post("http://localhost:9009/api/order", values)
      .then(res => {
        setSuccess(res.data.message)
        setValues(initalValues())
        setFailure('');
      })
      .catch(err => {
        setFailure(err.res.data.message);
        setSuccess('');
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {failure && <div className='failure'>{failure}</div>}
      {success && <div className='success'>{success}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullName}
          onChange={inputChange}
          placeholder="Type full name" 
          id="fullName" 
          type="text" 
        />
        </div>
        { errors.fullName && <div className='error'>{errors.fullName}</div>}
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
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}

        <label>
          <input
            name="1"
            type="checkbox"
            // checked={isChecked}
            onChange={handleCheckboxChange}
          />
          Pepperoni<br />
        </label> 

        <label>
          <input 
            name="2"
            type="checkbox"
            // checked={isChecked}
            onChange={handleCheckboxChange}
          />
          Green Peppers<br />
        </label>

        <label>
          <input
            name="3"
            type="checkbox"
            // checked={isChecked}
            onChange={handleCheckboxChange}
          />
          Pineapple<br />
        </label>

        <label>
          <input 
            name="4"
            type="checkbox"
            // checked={isChecked}
            onChange={handleCheckboxChange}
          />
          Mushrooms<br />
        </label>

        <label>
          <input
            name="5"
            type="checkbox"
            // checked={isChecked}
            onChange={handleCheckboxChange}
          />
          Ham<br />
        </label>
        
      </div>

      

      
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!enabled} type="submit" />
    </form>
  )
}
