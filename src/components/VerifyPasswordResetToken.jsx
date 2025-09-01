import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import banner from "../otherImages/sigupbanner.png"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import PasswordResetService from "../services/passwordResetService";
import Swal from "sweetalert2";

const VerifyPasswordResetToken = () => {
  const navigate = useNavigate();

  const resetPasswordSchema = Yup.object().shape({
    token: Yup.string().required('Token is Required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await PasswordResetService.verifyPasswordResetToken(values);
      console.log(response);
      localStorage.setItem('user_id', response.data.user_id);
      Swal.fire({
        icon: 'success',
        title: 'Token Verified Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/reset-password');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset token';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  return (
    <section className='auth bg-base d-flex'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img className="h-100vh w-100" src={banner} alt='' style={{ objectFit: "cover", objectPosition: "bottom" }} />
        </div>
      </div>
      <div className='auth-right py-22 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link to='/' className='mb-40 max-w-290-px'>
              <img src='assets/images/logo.png' alt='' />
            </Link>
            <h4 className='mb-12 fw-bold fs-1'>Verify Reset Token</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Enter your reset token to reset your password
            </p>
          </div>

          {/* Formik Form Starts */}
          <Formik
            initialValues={{ email: localStorage.getItem('email'), token: "" }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <div className='icon-field mb-16'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='mage:email' />
                  </span>
                  <Field name="token">
                    {({ field, form }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control h-56-px bg-neutral-50 radius-12"
                        placeholder="Reset Token"
                        maxLength={6}
                        inputMode="numeric"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          form.setFieldValue(field.name, value);
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="token"
                    component="div"
                    className="text-danger mt-2"
                  />
                </div>


                <button type='submit'
                  className='btn bg-primary py-16 w-100 radius-12 mt-32'
                  disabled={isSubmitting}>
                  {isSubmitting ? 'Submiting...' : 'Submit'}
                </button>


                <div className='mt-32 text-center text-sm'>
                  <p className='mb-0'>
                    Don’t have an account?{" "}
                    <Link to="/signup" className='primaryColor fw-semibold'>
                      Sign Up
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default VerifyPasswordResetToken;
