import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../store/slices/userSlice';

const AddUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileRef = useRef();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Client name is required'),
    email: Yup.string()
      .test(
        'is-valid-email',
        'Email must contain "@" and a domain like ".com"',
        function (value) {
          // Basic custom check
          return (
            typeof value === 'string' &&
            value.includes('@') &&
            /\.[a-z]{2,}$/.test(value.split('@')[1] || '')
          );
        }
      ),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    image: Yup.mixed().nullable(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // console.log("Form Values:", values);
      await dispatch(createUser(values)).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'User Added Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/manage-users'); // Redirect to users page after success
      resetForm();
      if (fileRef.current) fileRef.current.value = '';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error || 'Something went wrong while adding the user!',
      });
    }
  };

  return (
    <div className="container mt-4 mainForm">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form encType="multipart/form-data">
            <div className="imageEdit text-center mb-4">
                <img
                  src={values.image_url ?? `https://koderspedia-dashboard-backend.koderspedia.net/images/users/default.png`}
                  alt="userImage"
                  className="rounded-circle"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    boxShadow: '1px 1px 10px #00000036',
                  }}
                />
                <input
                  type="file"
                  id="userImageInput"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    if (file) {
                      setFieldValue("image", file);
                      setFieldValue("image_url", URL.createObjectURL(file));
                    }
                  }}
                  hidden
                />
                <label
                  htmlFor="userImageInput"
                  className="position-absolute"
                  style={{
                    bottom: "0px",
                    right: 'calc(0% - 0px)',
                    background: '#1d1d4e',
                    borderRadius: '50%',
                    padding: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 0 0 4px white',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9.5 9.5a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l9.5-9.5zM11.207 2L3 10.207V11h.793L13 2.793 11.207 2zM14 3.5 12.5 2 13 1.5 14.5 3 14 3.5z" />
                  </svg>
                </label>
              </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">Name *</label>
                <Field type="text" name="name" className="form-control" placeholder="e.g., John Doe" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <Field type="email" name="email" className="form-control" placeholder="e.g., johndoe@gmail.com" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
            </div>


            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Create Password *</label>
              <div className="input-group">
                <Field type={showPassword ? 'text' : 'password'} name="password" className="form-control" placeholder="******" />
                <button
                  type="button"
                  className="btn btn-outline-secondary eyeBtn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon icon={showPassword ? "bi:eye-slash-fill" : "bi:eye-fill"} width="22" height="22" />
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
              <div className="input-group">
                <Field type={showConfirm ? 'text' : 'password'} name="confirmPassword" className="form-control" placeholder="******" />
                <button
                  type="button"
                  className="btn btn-outline-secondary eyeBtn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <Icon icon={showConfirm ? "bi:eye-slash-fill" : "bi:eye-fill"} width="22" height="22" />
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddUserForm;
