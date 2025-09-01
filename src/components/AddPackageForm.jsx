import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import ReactQuill from 'react-quill-new';
import Swal from 'sweetalert2';
import PackagesService from '../services/packagesService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Package name is required'),
  description: Yup.string().required('Description is required'),
  category_id: Yup.number().required('Category is required'),
  client_id: Yup.number().nullable(),
  price: Yup.number().required('Price is required'),
  deliverables: Yup.array().min(1, 'At least one deliverable is required'),
  document: Yup.mixed().nullable(),
});

const AddPackageForm = () => {
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state.clients);
  // State to hold category options and loading state
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await PackagesService.getCategories();
        const options = response.data.data.categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }));
        setCategoryOptions(options);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const initialValues = {
    name: '',
    description: '',
    category_id: '',
    client_id: '',
    price: '',
    additional_notes: '',
    deliverables: [],
    document: null,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(values);
      await PackagesService.create(values);

      Swal.fire({
        icon: 'success',
        title: 'Package Created Successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/manage-packages'); // Redirect to manage packages page after success
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message || 'Something went wrong while adding the package!',
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
    return <p>Loading categories...</p>;
  }

  return (
    <div className="container mt-4 mainForm">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Package Name <span>*</span></label>
              <Field type="text" name="name" className="form-control" placeholder='e.g., Website Package' />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description <span>*</span></label>
              <ReactQuill
                theme="snow"
                value={values.description}
                onChange={(value) => setFieldValue('description', value)}
                placeholder="Enter package description"
              />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="client_id" className="form-label">Client</label>
              <Select
                options={clients.map(client => ({
                  value: client.id,
                  label: client.name // 👈 adjust this if your client model uses `full_name`, `company_name`, etc.
                }))}
                placeholder="Select a client"
                value={clients
                  .map(client => ({ value: client.id, label: client.name }))
                  .find(opt => opt.value === values.client_id)}
                onChange={(option) => setFieldValue('client_id', option.value)}
              />
              <ErrorMessage name="client_id" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="category_id" className="form-label">Category <span>*</span></label>
              <Select
                options={categoryOptions}
                placeholder="Select a category"
                value={categoryOptions.find(opt => opt.value === values.category_id)}
                onChange={(option) => setFieldValue('category_id', option.value)}
              />
              <ErrorMessage name="category_id" component="div" className="text-danger" />
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label htmlFor="price" className="form-label">Price ($USD) <span>*</span></label>
                <Field type="number" name="price" className="form-control" placeholder='e.g., 500' />
                <ErrorMessage name="price" component="div" className="text-danger" />
              </div>

              <div className="mb-3 col-md-6">
                <label htmlFor="deliverables" className="form-label">Package Deliverables <span>*</span></label>
                <CreatableSelect
                  isMulti
                  isClearable
                  isSearchable
                  placeholder="Type and press enter"
                  value={values.deliverables}
                  onChange={(selectedOptions) => setFieldValue('deliverables', selectedOptions || [])}
                />
                <ErrorMessage name="deliverables" component="div" className="text-danger" />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="additional_notes" className="form-label">Additional Notes</label>
                <Field type="text" name="additional_notes" className="form-control" />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="document" className="form-label">Upload Scope of Work / Document <span>*</span></label>
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPackageForm;
