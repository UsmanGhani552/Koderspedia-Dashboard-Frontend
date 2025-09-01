import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill-new';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { updateInvoice } from '../store/slices/invoiceSlice';
import PackagesService from '../services/packagesService';
import InvoiceService from '../services/invoiceService';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Invoice title is required'),
  price: Yup.number().required('Price is required').positive(),
  remaining_price: Yup.number().required('Remaining price is required'),
  client_id: Yup.string().required('Client is required'),
  description: Yup.string().required('Description is required'),
  category_id: Yup.string().required('Category is required'),
  payment_type_id: Yup.string().required('Payment type is required'),
  brand_id: Yup.string().required("Brand is required"),
  sale_type: Yup.string().required('Sale type is required'),
});

const EditInvoiceForm = () => {
  const { state } = useLocation();
  const invoiceData = state?.invoice;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state.clients);
  const { brands } = useSelector((state) => state.brands);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [paymentTypeOptions, setPaymentTypeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch payment types
        const paymentTypesResponse = await InvoiceService.getPaymentTypes();
        setPaymentTypeOptions(
          paymentTypesResponse.data.data.payment_types.map(pt => ({
            value: pt.id,
            label: pt.name,
          }))
        );

        // Fetch categories
        const categoriesResponse = await PackagesService.getCategories();
        setCategoryOptions(
          categoriesResponse.data.data.categories.map(cat => ({
            value: cat.id,
            label: cat.name,
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load required data',
        });
        navigate('/manage-invoices');
      }
    };

    fetchData();
  }, [navigate]);

  // Get client options from Redux state
  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.name,
  }));

  const initialValues = {
    title: invoiceData?.title || '',
    price: invoiceData?.price || '',
    remaining_price: invoiceData?.remaining_price || '',
    client_id: invoiceData?.client_id || '',
    description: invoiceData?.description || '',
    category_id: invoiceData?.category_id || '',
    payment_type_id: invoiceData?.payment_type_id || '',
    brand_id: invoiceData?.brand_id || '',
    sale_type: invoiceData?.sale_type || 'Fresh Sale',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateInvoice({
        id: invoiceData.id,
        invoiceData: values
      })).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Invoice Updated Successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/manage-invoice');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update invoice',
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting, handleBlur }) => (
          <Form className="mainForm">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Invoice Title <span className="text-danger">*</span>
              </label>
              <Field
                type="text"
                className="form-control"
                id="title"
                name="title"
              />
              <ErrorMessage name="title" component="div" className="text-danger" />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="price" className="form-label">
                  Price ($) <span className="text-danger">*</span>
                </label>
                <Field
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                />
                <ErrorMessage name="price" component="div" className="text-danger" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="remaining_price" className="form-label">
                  Remaining Price ($) <span className="text-danger">*</span>
                </label>
                <Field
                  type="number"
                  className="form-control"
                  id="remaining_price"
                  name="remaining_price"
                />
                <ErrorMessage name="remaining_price" component="div" className="text-danger" />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="client_id" className="form-label">
                Client <span className="text-danger">*</span>
              </label>
              <Select
                id="client_id"
                name="client_id"
                options={clientOptions}
                value={clientOptions.find(option => option.value === values.client_id)}
                onChange={(selectedOption) =>
                  setFieldValue("client_id", selectedOption?.value)
                }
                onBlur={handleBlur}
                isSearchable
                placeholder="Select a client"
              />
              <ErrorMessage name="client_id" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description <span className="text-danger">*</span>
              </label>
              <ReactQuill
                theme="snow"
                value={values.description}
                onChange={(value) => setFieldValue("description", value)}
                placeholder="Invoice description"
                id="description"
              />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="payment_type" className="form-label">
                Brand <span>*</span>
              </label>
              <Select
                name="brand_id"
                id="brand_id"
                options={brands?.map(brand => ({
                  value: brand.id,
                  label: brand.name
                })) || []}
                value={brands?.find(brand => brand.id === values.brand_id) ? {
                  value: values.brand_id,
                  label: brands.find(brand => brand.id === values.brand_id)?.name
                } : null}
                onChange={(option) => setFieldValue("brand_id", option?.value || "")}
                placeholder="Select a brand"
                isSearchable
              />
              <ErrorMessage name="brand_id" component="div" className="text-danger" />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="category_id" className="form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <Select
                  id="category_id"
                  name="category_id"
                  options={categoryOptions}
                  value={categoryOptions.find(option => option.value === values.category_id)}
                  onChange={(selectedOption) =>
                    setFieldValue("category_id", selectedOption?.value)
                  }
                  onBlur={handleBlur}
                  isSearchable
                  placeholder="Select a category"
                />
                <ErrorMessage name="category_id" component="div" className="text-danger" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="payment_type_id" className="form-label">
                  Payment Type <span className="text-danger">*</span>
                </label>
                <Select
                  id="payment_type_id"
                  name="payment_type_id"
                  options={paymentTypeOptions}
                  value={paymentTypeOptions.find(option => option.value === values.payment_type_id)}
                  onChange={(selectedOption) =>
                    setFieldValue("payment_type_id", selectedOption?.value)
                  }
                  onBlur={handleBlur}
                  isSearchable
                  placeholder="Select payment type"
                />
                <ErrorMessage name="payment_type_id" component="div" className="text-danger" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Sale Type <span className="text-danger">*</span>
              </label>
              <div>
                {["fresh sale", "upsell", "recurring"].map((type) => (
                  <div className="form-check" key={type}>
                    <Field
                      type="radio"
                      id={`sale_type_${type.replace(' ', '_')}`}
                      name="sale_type"
                      value={type}
                      className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor={type.replace(" ", "")}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              <ErrorMessage name="sale_type" component="div" className="text-danger" />
            </div>

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Invoice'}
              </button>

            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditInvoiceForm;