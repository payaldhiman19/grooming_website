
import React, { useState } from 'react';
import './AssessmentForm.css'

const AssessmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    skinType: '',
    question1: '',
    question2: [], // Initialize question2 as an array for multiple selections
    feedback: '',
    consent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle the checkbox logic for multiple selections
      if (name === 'question2') {
        setFormData((prevData) => {
          const updatedQuestion2 = checked
            ? [...prevData.question2, value] // Add the value if checked
            : prevData.question2.filter((item) => item !== value); // Remove the value if unchecked

          return { ...prevData, question2: updatedQuestion2 };
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/submit-assessment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Success message
        setFormData({
          name: '',
          skinType: '',
          question1: '',
          question2: [],
          feedback: '',
          consent: false,
        }); // Reset the form
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to submit form. Please try again later.');
    }
  };

  return (
    <div className="assessment-form-container">
      <h3 className="form-title">Assessment Form</h3>
      <form onSubmit={handleSubmit} className="assessment-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Your skin type</label>
          <select
            name="skinType"
            value={formData.skinType}
            onChange={handleChange}
            required
          >
            <option value="">-please select one-</option>
            <option value="Oily">Oily</option>
            <option value="Dry">Dry</option>
            <option value="Combination">Combination</option>
            <option value="Sensitive">Sensitive</option>
          </select>
        </div>

        <div className="form-group">
          <label>Question 1: Do you have a skincare routine?</label>
          <select
            name="question1"
            value={formData.question1}
            onChange={handleChange}
            required
          >
            <option value="">-please select one-</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Question 2: Select any skin issues you are facing</label>
          <label>
            <input
              type="checkbox"
              name="question2"
              value="Acne"
              checked={formData.question2.includes('Acne')}
              onChange={handleChange}
            />
            Acne
          </label>
          <label>
            <input
              type="checkbox"
              name="question2"
              value="Dry Skin"
              checked={formData.question2.includes('Dry Skin')}
              onChange={handleChange}
            />
            Dry Skin
          </label>
          <label>
            <input
              type="checkbox"
              name="question2"
              value="Oily Skin"
              checked={formData.question2.includes('Oily Skin')}
              onChange={handleChange}
            />
            Oily Skin
          </label>
          <label>
            <input
              type="checkbox"
              name="question2"
              value="Wrinkles"
              checked={formData.question2.includes('Wrinkles')}
              onChange={handleChange}
            />
            Wrinkles
          </label>
          <label>
            <input
              type="checkbox"
              name="question2"
              value="Hyperpigmentation"
              checked={formData.question2.includes('Hyperpigmentation')}
              onChange={handleChange}
            />
            Hyperpigmentation
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="feedback">Any other issue?</label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="consent">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              required
            />
            I consent to the terms and conditions
          </label>
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn">
            Submit Assessment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentForm;














////////////////////////
// import React, { useState } from 'react';
// import './AssessmentForm.css';

// const AssessmentForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     feedback: '',
//     rating: 1,
//     question1: '',
//     question2: [], // Initialize question2 as an array for multiple selections
//     consent: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox') {
//       // Handle the checkbox logic for multiple selections
//       if (name === 'question2') {
//         setFormData((prevData) => {
//           const updatedQuestion2 = checked
//             ? [...prevData.question2, value] // Add the value if checked
//             : prevData.question2.filter((item) => item !== value); // Remove the value if unchecked

//           return { ...prevData, question2: updatedQuestion2 };
//         });
//       } else {
//         setFormData({
//           ...formData,
//           [name]: checked,
//         });
//       }
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form Data Submitted:', formData);
//     // Here, you can handle the form submission (e.g., send data to a backend or display a success message)
//     alert('Your assessment has been submitted successfully!');
//   };

//   return (
//     <div className="assessment-form-container">
//       <h3 className="form-title">Assessment Form</h3>
//       <form onSubmit={handleSubmit} className="assessment-form">
//         <div className="form-group">
//           <label htmlFor="name">Full Name</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Your skin type</label>
//           <select
//             name="skinType"
//             value={formData.skinType}
//             onChange={handleChange}
//             required
//           >
//             <option>-please select one-</option>
//             <option>Oily</option>
//             <option>Dry</option>
//             <option>Combination</option>
//             <option>Sensitive</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Question 1: Do you have a skincare routine?</label>
//           <select
//             name="question1"
//             value={formData.question1}
//             onChange={handleChange}
//             required
//           >
//             <option>Yes</option>
//             <option>No</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Question 2: Select any skin issues you are facing</label>
//           <label>
//             <input
//               type="checkbox"
//               name="question2"
//               value="Acne"
//               checked={formData.question2.includes('Acne')}
//               onChange={handleChange}
//             />
//             Acne
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               name="question2"
//               value="Dry Skin"
//               checked={formData.question2.includes('Dry Skin')}
//               onChange={handleChange}
//             />
//             Dark Circles
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               name="question2"
//               value="Oily Skin"
//               checked={formData.question2.includes('Oily Skin')}
//               onChange={handleChange}
//             />
//             Dark spots
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               name="question2"
//               value="Wrinkles"
//               checked={formData.question2.includes('Wrinkles')}
//               onChange={handleChange}
//             />
//             Wrinkles
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               name="question2"
//               value="Hyperpigmentation"
//               checked={formData.question2.includes('Hyperpigmentation')}
//               onChange={handleChange}
//             />
//             Hyperpigmentation
//           </label>
//         </div>

//         <div className="form-group">
//           <label htmlFor="feedback">Any other issue?</label>
//           <textarea
//             id="feedback"
//             name="feedback"
//             value={formData.feedback}
//             onChange={handleChange}
//             rows="4"
//             required
//           ></textarea>
//         </div>

//         <div className="form-group">
//           <label htmlFor="consent">
//             <input
//               type="checkbox"
//               id="consent"
//               name="consent"
//               checked={formData.consent}
//               onChange={handleChange}
//               required
//             />
//             I consent to the terms and conditions
//           </label>
//         </div>

//         <div className="form-group">
//           <button type="submit" className="submit-btn">
//             Submit Assessment
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AssessmentForm;
