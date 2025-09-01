import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { createBrand } from '../store/slices/brandSlice';

const AddBrandForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef();

  const initialValues = {
    name: '',
    email: '',
    address: '',
    logo: null,
    logo_mini: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Brand name is required'),
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
    address: Yup.string().required('Address is required'),
    logo: Yup.mixed().required('Logo is required'),
    logo_mini: Yup.mixed().required('Logo mini is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log(values);
      await dispatch(createBrand(values)).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Brand Added Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/manage-brands'); // Redirect to brands page after success
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
                <label htmlFor="name" className="form-label">Brand Name *</label>
                <Field type="text" name="name" className="form-control" placeholder="e.g., John Doe" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <Field type="email" name="email" className="form-control" placeholder="e.g., johndoe@gmail.com" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <Field as="textarea" name="address" className="form-control" placeholder="e.g., 123 Main St" style={{ backgroundColor: '#ebecef' }} />
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="form-label">Upload Logo</label>
              <input
                type="file"
                className="form-control"
                name="logo"
                ref={fileRef}
                accept="image/*"
                onChange={(event) => setFieldValue('logo', event.currentTarget.files[0])}
              />
              <ErrorMessage name="logo" component="div" className="text-danger" />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="form-label">Upload Logo Icon</label>
              <input
                type="file"
                className="form-control"
                name="logo_mini"
                ref={fileRef}
                accept="image/*"
                onChange={(event) => setFieldValue('logo_mini', event.currentTarget.files[0])}
              />
              <ErrorMessage name="logo_mini" component="div" className="text-danger" />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddBrandForm;
