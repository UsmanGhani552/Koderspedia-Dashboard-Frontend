import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { updateClient } from '../store/slices/clientSlice';
import { fetchPackages } from '../store/slices/packagesSlice';
import ClientService from '../services/clientService';
import { Icon } from '@iconify/react';

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
  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, 'Phone number must be 10 or 11 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .nullable()
    .min(6, 'Password must be at least 6 characters')
    .notRequired(),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .when('password', {
      is: (password) => password && password.length > 0,
      then: (schema) => schema.required('Confirm password is required when password is provided'),
      otherwise: (schema) => schema.notRequired()
    })
});

const EditClientForm = () => {
  const { state } = useLocation();
  const clientData = state?.client;
  console.log(clientData)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [assignedPackagesList, setAssignedPackagesList] = useState([]);
  const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);

  const formikSetFieldValueRef = useRef(null); // ✅ To store setFieldValue outside Formik
  const formikValuesRef = useRef(null); // ✅ To check if already set

  const { packages } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  useEffect(() => {
    const fetchAssignedPackages = async () => {
      try {
        const res = await ClientService.assignedPackages(clientData.id);
        setAssignedPackagesList(res.data.data.assigned_packages);
      } catch (err) {
        console.error("Failed to fetch assigned packages", err);
      }
    };

    if (clientData?.id) {
      fetchAssignedPackages();
    }
  }, [clientData]);

  // ✅ Hook that safely sets default assigned package
  useEffect(() => {
    if (
      assignedPackagesList.length > 0 &&
      formikSetFieldValueRef.current &&
      !formikValuesRef.current?.assignedPackages
    ) {
      const defaultPackage = assignedPackagesList[0];
      const pkgOption = {
        value: defaultPackage.package.id,
        label: defaultPackage.package.name,
        package: defaultPackage.package,
        status: defaultPackage.status,
      };
      formikSetFieldValueRef.current("assignedPackages", pkgOption);
      setSelectedPackageDetails(pkgOption);
    }
  }, [assignedPackagesList]);

  const packageOptions = packages.filter(pkg => pkg.client_id === clientData.id || pkg.client_id === null).map(pkg => ({
    value: pkg.id,
    label: pkg.name,
    client_id: pkg.client_id,
  }));
  console.log(packageOptions)
  const initialValues = {
    name: clientData?.name || '',
    email: clientData?.email || '',
    phone: clientData?.phone || '',
    password: '', // Empty string instead of null
    confirmPassword: '', // Empty string instead of null
    image_url: clientData?.image_url || '',
    address: clientData?.address || '',
    image: null,
    assignedPackages: null,
    package_id: null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateClient({ id: clientData.id, clientData: values })).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Client Updated Successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/manage-clients');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error || 'Failed to update client',
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting, handleBlur }) => {
        // Store refs for useEffect
        formikSetFieldValueRef.current = setFieldValue;
        formikValuesRef.current = values;

        return (
          <Form className="container mt-4 mainForm">
            {/* Image Upload */}
            <div className="imageEdit text-center mb-4">
              <img
                src={values.image_url}
                alt="clientImage"
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
                id="clientImageInput"
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
                htmlFor="clientImageInput"
                className="position-absolute"
                style={{
                  bottom: "0px",
                  right: 'calc(0% - 0px)',
                  background: '#1d1d4e',
                  borderRadius: '50%',
                  height: '40px',
                  width: '40px',
                  cursor: 'pointer',
                  boxShadow: '0 0 0 4px white',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-pencil" viewBox="0 0 16 16">
                  <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9.5 9.5a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l9.5-9.5zM11.207 2L3 10.207V11h.793L13 2.793 11.207 2zM14 3.5 12.5 2 13 1.5 14.5 3 14 3.5z" />
                </svg>
              </label>
            </div>

            {/* Client Info */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Client Name <span>*</span></label>
              <Field type="text" className="form-control" id="name" name="name" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email Address <span>*</span></label>
                <Field type="email" className="form-control" id="email" name="email" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">Phone Number <span>*</span></label>
                <Field type="number" className="form-control" id="phone" name="phone" />
                <ErrorMessage name="phone" component="div" className="text-danger" />
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
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <Field as="textarea" name="address" className="form-control" placeholder="e.g., 123 Main St" style={{ backgroundColor: '#ebecef' }} />
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>

            {/* Assigned Packages */}
            <div className="mb-4">
              <label htmlFor="assignedPackages" className="form-label">Assigned Package <span>*</span></label>
              <Select
                id="assignedPackages"
                name="assignedPackages"
                options={assignedPackagesList.map(pkg => ({
                  value: pkg.package.id,
                  label: pkg.package.name,
                  package: pkg.package,
                  status: pkg.status,
                }))}
                value={values.assignedPackages}
                onChange={(selected) => {
                  setFieldValue("assignedPackages", selected);
                  setSelectedPackageDetails(selected);
                }}
                isSearchable
                placeholder="Select a package"
              />
              <ErrorMessage name="assignedPackages" component="div" className="text-danger" />
            </div>

            {/* Status & Deliverables */}
            <div className="row mt-20">
              <div className="mb-4 col-md-6">
                <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
                <Field
                  type="text"
                  name="paymentStatus"
                  id="paymentStatus"
                  className="form-control"
                  value={
                    selectedPackageDetails?.status === "0"
                      ? "Pending"
                      : selectedPackageDetails?.status === "1"
                        ? "Paid"
                        : ""
                  }
                  onChange={() => { }}
                />
              </div>

              <div className="mb-4 col-md-6">
                <label htmlFor="packageDeliverables" className="form-label">Package Deliverables</label>
                <Select
                  id="packageDeliverables"
                  name="packageDeliverables"
                  isMulti
                  onChange={() => { }}
                  onBlur={handleBlur}
                  value={
                    selectedPackageDetails?.package?.deliverables?.map(d => ({
                      label: d.name,
                      value: d.id
                    })) || []
                  }
                  placeholder="No deliverables"
                />
              </div>
            </div>
            {/* Other Package */}
            <div className="mb-4 mt-20">
              <label htmlFor="otherPackages" className="form-label">Other Package</label>
              <Select
                id="otherPackages"
                name="package_id"
                options={packageOptions}
                value={packageOptions.find(option => option.value === values.package_id)}
                onChange={(selectedOption) =>
                  setFieldValue("package_id", selectedOption?.value)
                }
                onBlur={handleBlur}
                isSearchable
                placeholder="Select a package"
              />
              <ErrorMessage name="package_id" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Client'}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditClientForm;
