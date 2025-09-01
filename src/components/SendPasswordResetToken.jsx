import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import banner from "../otherImages/sigupbanner.png"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import PasswordResetService from "../services/passwordResetService";
import Swal from "sweetalert2";

const SendPasswordResetToken = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState(null);
  const resetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setApiError(null);
    try {
      await PasswordResetService.sendPasswordResetToken(values);
      localStorage.setItem('email', values.email);
      Swal.fire({
        icon: 'success',
        title: 'Reset Token Send Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/verify-password-reset-token');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset token';
      setApiError(errorMessage);
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
            <h4 className='mb-12 fw-bold fs-1'>Reset Password</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Formik Form Starts */}
          <Formik
            initialValues={{ email: "" }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {apiError && (
                  <div className='alert alert-danger mb-3'>
                    {apiError}
                  </div>
                )}
                <div className='icon-field mb-16'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='mage:email' />
                  </span>
                  <Field
                    type='email'
                    name='email'
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    placeholder='Email'
                    required
                  />
                  <ErrorMessage
                    name="email"
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

export default SendPasswordResetToken;
