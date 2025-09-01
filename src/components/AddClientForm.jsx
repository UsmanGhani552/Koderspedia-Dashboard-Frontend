import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import { createClient } from '../store/slices/clientSlice';
import { useNavigate } from 'react-router-dom';

const AddClientForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileRef = useRef();

  const initialValues = {
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
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
    phone: Yup.string()
      .matches(/^[0-9]{10,11}$/, 'Phone number must be 10 or 11 digits')
      .required('Phone number is required'),
    address: Yup.string().nullable(),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    image: Yup.mixed().nullable(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(createClient(values)).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Client Added Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/manage-clients'); // Redirect to clients page after success
      resetForm();
      if (fileRef.current) fileRef.current.value = '';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error || 'Something went wrong while adding the client!',
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
        {({ setFieldValue, isSubmitting }) => (
          <Form encType="multipart/form-data">


            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">Client Name *</label>
                <Field type="text" name="name" className="form-control" placeholder="e.g., John Doe" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <Field type="text" name="username" className="form-control" placeholder="e.g., johndoe123" />
                <ErrorMessage name="username" component="div" className="text-danger" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <Field type="email" name="email" className="form-control" placeholder="e.g., johndoe@gmail.com" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">Phone Number *</label>
                <Field type="number" name="phone" className="form-control" placeholder="e.g., 33304442" />
                <ErrorMessage name="phone" component="div" className="text-danger" />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <Field as="textarea" name="address" className="form-control" placeholder="e.g., 123 Main St" style={{ backgroundColor: '#ebecef' }} />
              <ErrorMessage name="address" component="div" className="text-danger" />
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

            <div className="mb-4">
              <label htmlFor="image" className="form-label">Upload Picture</label>
              <input
                type="file"
                className="form-control"
                name="image"
                ref={fileRef}
                accept="image/*"
                onChange={(event) => setFieldValue('image', event.currentTarget.files[0])}
              />
              <ErrorMessage name="image" component="div" className="text-danger" />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddClientForm;
