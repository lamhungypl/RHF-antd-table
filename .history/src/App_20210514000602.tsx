import React, { useState } from 'react';

import './App.css';

import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const [mode, setMode] = useState('edit');
  const onEdit = () => {
    setMode('edit');
    handleSubmit(data => {
      console.log(JSON.stringify(data));
    })();
  };
  const onDelete = () => {
    setMode('send');
    handleSubmit(data => {
      console.log(JSON.stringify(data));
    })();
  };

  return (
    <div className="App">
      <form>
        {/* Required Grade on submit, not on edit */}
        <div>
          <label htmlFor="grade">Grade</label>
          <input
            {...register('grade', {
              validate: inputValue => {
                if (mode === 'send') {
                  // validate the input
                  const isFieldValid = !!inputValue; // just an example, do this however you want

                  if (!isFieldValid) {
                    return 'Grade is required'; // returning a string means this input is invalid. The string will be the error message
                  }
                  // return true if everything is valid
                  return undefined;
                }
                // not create mode, input is valid by default
                return undefined;
              },
            })}
            placeholder="grade"
          />
          <ErrorMessage errors={errors} name="grade" render={({ message }) => <p>{message}</p>} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" className="saveBtn" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="saveBtn" onClick={onDelete}>
            Submit
          </button>
        </div>

        {/* <input type="submit" value="Submit" /> */}
      </form>
    </div>
  );
}

export default App;
