import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import DefaultTopBar from "../components/DefaultTopBar";
import HomeTopBar from "../components/HomeTopBar";
import profilePic from "../otherImages/UserPic.png";
import EmailAvatar from "../otherImages/EmailAvator.png";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { editProfile } from "../store/slices/authSlice";

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),

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

  phone: Yup.string().required('Phone number is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Must be at least 10 digits')
    .max(11, 'Must be less than 11 digits'),

  address: Yup.string()
    .max(100, 'Address must not exceed 100 characters'),

  emails: Yup.array().of(
    Yup.object().shape({
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
      )
    })
  )
});


const EditProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues = {
    name: user?.name || '',
    email: user?.email || '', // Primary email (separate field)
    phone: user?.phone || '',
    address: user?.address || '',
    image_url: user?.image_url || profilePic,
    image: null,
    emails: user?.client_emails || [] // Array of email objects
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        emails: values.emails.map(email => email.email) // Extract just the email strings
      };
      await dispatch(editProfile(payload)).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Client Updated Successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/edit-profile')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error || 'Failed to update client',
      });
    }
  };

  return (
    <MasterLayout>
      <HomeTopBar
        title={`Welcome Back, ${user.name?.replace(/\b\w/g, c => c.toUpperCase())}!`}
        desc="Your recruitment metrics and activities at a glance"
      />
      <DefaultTopBar title="Edit Employee Details" />
      <div className="container mt-4 mainForm">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting  }) => (
            <Form>
              <div className="card p-5">
                {/* Profile Image and Basic Info */}
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 position-relative">
                  <div className="d-flex align-items-center gap-3">
                    <div className="position-relative" style={{ width: "60px", height: "60px" }}>
                      <img
                        src={values.image_url}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                      <input
                        type="file"
                        id="profileImageInput"
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
                        htmlFor="profileImageInput"
                        className="position-absolute d-flex align-items-center justify-content-center"
                        style={{
                          top: "0",
                          right: "0",
                          width: "24px",
                          height: "24px",
                          background: '#1d1d4e',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          transform: 'translate(25%, 25%)',
                          border: '2px solid white'
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          fill="white"
                          className="bi bi-pencil"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9.5 9.5a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l9.5-9.5zM11.207 2L3 10.207V11h.793L13 2.793 11.207 2zM14 3.5 12.5 2 13 1.5 14.5 3 14 3.5z" />
                        </svg>
                      </label>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-semibold">{values.name || 'Alexa Rawles'}</h5>
                      <span className="text-secondary-light">{values.email || 'alexarawles@gmail.com'}</span>
                    </div>
                  </div>
                </div>

                {/* Main Form Fields */}
                <div className="row gy-3 mt-4">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Full Name</label>
                    <Field
                      name="name"
                      type="text"
                      className="form-control p-3 form-control1"
                      placeholder="Alexa Rawles"
                    />
                  </div>
                  <ErrorMessage name="name" component="div" className="text-danger small" />
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Primary Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control p-3 form-control1"
                      placeholder="alexarawles@gmail.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Phone Number</label>
                    <Field
                      type="text"
                      name="phone"
                      className="form-control form-control1 p-3"
                      placeholder="+01"
                    />
                    <ErrorMessage name="phone" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Address</label>
                    <Field
                      type="text"
                      name="address"
                      className="form-control1 form-control p-3"
                      placeholder="Enter your address"
                    />
                    <ErrorMessage name="address" component="div" className="text-danger small" />
                  </div>
                </div>

                {/* Client Emails FieldArray */}
                <div className="mt-5">
                  <h6 className="fw-bold mb-3">Additional Email Addresses</h6>
                  <FieldArray name="emails">
                    {({ push, remove }) => (
                      <div>
                        {values.emails.map((client, index) => (
                          <div key={client.id || index} className="d-flex align-items-center gap-3 mb-3">
                            <img
                              src={EmailAvatar}
                              alt="email avatar"
                              style={{ width: "45px", height: "45px", borderRadius: "50%" }}
                            />
                            <div className="flex-grow-1">
                              <Field
                                name={`emails.${index}.email`}
                                type="email"
                                className="form-control"
                                placeholder="Enter additional email"
                              />
                              <ErrorMessage
                                name={`emails.${index}.email`}
                                component="div"
                                className="text-danger small"
                              />
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => remove(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn bg-gray mt-2"
                          onClick={() => push({ email: '', client_id: user?.id })}
                        >
                          + Add Email Address
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Submit Button */}
                <div className="mt-5 text-end">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </MasterLayout>
  );
};

export default EditProfilePage;