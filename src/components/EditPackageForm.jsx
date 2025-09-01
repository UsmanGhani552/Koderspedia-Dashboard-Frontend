import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import PackagesService from '../services/packagesService';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Package name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required'),
  category_id: Yup.number().required('Category is required'),
  document: Yup.mixed().nullable(),
});

const EditPackageForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const packageData = state?.package;
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    price: '',
    additional_notes: '',
    document: null,
    category_id: '',
  });

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await PackagesService.getCategories();
        const categories = res.data.data.categories || [];
        const options = categories.map(cat => ({
          value: cat.id,
          label: cat.name,
        }));
        setCategoryOptions(options);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Set initial form values from packageData
  useEffect(() => {
    if (packageData) {
      setInitialValues({
        name: packageData.name || '',
        description: packageData.description || '',
        price: packageData.price || '',
        additional_notes: packageData.additional_notes || '',
        document: null,
        category_id: Number(packageData.category_id) || '',
      });
    }
  }, [packageData, categoryOptions]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await PackagesService.update(packageData.id, values);

      Swal.fire({
        icon: 'success',
        title: 'Package Updated Successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/manage-packages'); // Redirect to manage packages page after success
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while updating the package!',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4 mainForm">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Package Name <span>*</span></label>
              <Field type="text" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description <span>*</span></label>
              <ReactQuill
                theme="snow"
                value={values.description}
                onChange={(value) => setFieldValue('description', value)}
                placeholder="Details about what the package includes"
              />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="category_id" className="form-label">Category <span>*</span></label>
              <Select
                name="category_id"
                options={categoryOptions}
                placeholder="Select a category"
                value={categoryOptions.find(opt => opt.value === values.category_id) || null}
                onChange={(selectedOption) =>
                  setFieldValue('category_id', selectedOption ? selectedOption.value : '')
                }
              />
              <ErrorMessage name="category_id" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price ($USD) <span>*</span></label>
              <Field type="number" name="price" className="form-control" />
              <ErrorMessage name="price" component="div" className="text-danger" />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="additional_notes" className="form-label">Additional Notes</label>
                <Field type="text" name="additional_notes" className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="document" className="form-label">Upload New Document</label>
                <input
                  type="file"
                  name="document"
                  className="form-control"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setFieldValue('document', e.currentTarget.files[0])}
                />
                <ErrorMessage name="document" component="div" className="text-danger" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Package'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditPackageForm;
