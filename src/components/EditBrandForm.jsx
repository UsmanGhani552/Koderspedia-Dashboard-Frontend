import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { updateBrand } from '../store/slices/brandSlice';

const validationSchema = Yup.object().shape({
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
});

const EditBrandForm = () => {
  const { state } = useLocation();
  const brandData = state?.brand;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef();

  const initialValues = {
    name: brandData?.name || '',
    email: brandData?.email || '',
    logo_url: brandData?.logo_url || '',
    logo_mini_url: brandData?.logo_mini_url || '',
    address: brandData?.address || '',
    logo: null,
    logo_mini: null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateBrand({ id: brandData.id, brandData: values })).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Brand Updated Successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/manage-brands');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error || 'Failed to update brand',
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="container mt-4 mainForm">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, isSubmitting }) => {

          return (
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
          );
        }}
      </Formik>
    </div>
  );
};

export default EditBrandForm;
