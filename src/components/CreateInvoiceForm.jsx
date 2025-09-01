import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill-new";
import Select from 'react-select';
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import PackagesService from "../services/packagesService";
import { useDispatch } from "react-redux";
import { createInvoice } from "../store/slices/invoiceSlice";
import InvoiceService from "../services/invoiceService";
import { useNavigate } from "react-router-dom";
import { fetchClients } from "../store/slices/clientSlice";
import { fetchBrands } from "../store/slices/brandSlice";

const validationSchema = Yup.object({
  title: Yup.string().required("Invoice Title is required"),
  price: Yup.number().typeError("Order price must be a number").required("Order price is required"),
  remaining_price: Yup.number().typeError("Remaining price must be a number"),
  client_id: Yup.string().required("client is required"),
  description: Yup.string().required("Description is required"),
  category_id: Yup.string().required("Category is required"),
  payment_type_id: Yup.string().required("Payment Type is required"),
  brand_id: Yup.string().required("Brand is required"),
  sale_type: Yup.string().required("Sale Type is required"),
});

const initialValues = {
  title: "",
  price: 0,
  remaining_price: 0,
  client_id: "",
  description: "",
  category_id: "",
  payment_type_id: "",
  brand_id: "",
  sale_type: "",
};

const CreateInvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state.clients);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [clientOptions, setClientOptions] = useState([]);
  const [loadingClient, setLoadingClients] = useState(true);
  const [paymentTypeOptions, setPaymentTypeOptions] = useState([]);
  const { brands } = useSelector((state) => state.brands);
    useEffect(() => {
      dispatch(fetchClients());
    }, [dispatch]);
  
    useEffect(() => {
      dispatch(fetchBrands());
    }, [dispatch]);
  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const response = await InvoiceService.getPaymentTypes();
        const options = response.data.data.payment_types.map((pt) => ({
          value: pt.id,
          label: pt.name,
        }));
        setPaymentTypeOptions(options);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchPaymentTypes();
  }, []);
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
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const options = clients.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }));
        setClientOptions(options);
      } catch (error) {
        console.error('Failed to fetch Clients:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(createInvoice(values)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Invoice Created Successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
      resetForm();
      navigate('/manage-invoice');
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error || "Something went wrong while creating the invoice!",
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="container mt-4 mainForm" encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Invoice Title <span>*</span>
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
            <div className="mb-3 col-md-6">
              <label htmlFor="price" className="form-label">
                Order price ($) <span>*</span>
              </label>
              <Field
                type="number"
                className="form-control"
                id="price"
                name="price"
              />
              <ErrorMessage name="price" component="div" className="text-danger" />
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="remaining_price" className="form-label">
                Remaining price ($) <span>*</span>
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
          <div className="mb-20">
            <label htmlFor="client" className="form-label">
              client <span>*</span>
            </label>
            <Select
              name="client_id"
              id="client"
              options={clientOptions}
              value={clientOptions.find(opt => opt.value === values.client_id)}
              onChange={option => setFieldValue("client_id", option ? option.value : "")}
              placeholder="Select a client"
              isSearchable
            />
            <ErrorMessage name="client" component="div" className="text-danger" />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description <span>*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={values.description}
              onChange={val => setFieldValue("description", val)}
              placeholder="Details about what the package includes"
              id="description"
              name="description"
            />
            <ErrorMessage name="description" component="div" className="text-danger" />
          </div>
          <div className="mb-20">
            <label htmlFor="category" className="form-label">
              Category <span>*</span>
            </label>
            <Select
              name="category_id"
              id="category"
              options={categoryOptions}
              value={categoryOptions.find(opt => opt.value === values.category_id)}
              onChange={option => setFieldValue("category_id", option ? option.value : "")}
              placeholder="Select a category"
              isSearchable
            />
            <ErrorMessage name="category" component="div" className="text-danger" />
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
          <div className="mb-3">
            <label htmlFor="payment_type" className="form-label">
              Payment Type <span>*</span>
            </label>
            <Select
              name="payment_type_id"
              id="payment_type"
              options={paymentTypeOptions}
              value={paymentTypeOptions.find(opt => opt.value === values.payment_type_id)}
              onChange={option => setFieldValue("payment_type_id", option ? option.value : "")}
              placeholder="Select a payment type"
              isSearchable
            />
            <ErrorMessage name="payment_type" component="div" className="text-danger" />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Sale Type <span>*</span>
            </label>
            <div>
              {["fresh sale", "upsell", "recurring"].map(type => (
                <div className="form-check" key={type}>
                  <Field
                    className="form-check-input"
                    type="radio"
                    name="sale_type"
                    id={type.replace(" ", "")}
                    value={type}
                  />
                  <label className="form-check-label" htmlFor={type.replace(" ", "")}>
                    {type}
                  </label>
                </div>
              ))}
            </div>
            <ErrorMessage name="sale_type" component="div" className="text-danger" />
          </div>
          <button type="submit" className="btn btn-primary">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateInvoiceForm;
// ...existing code...