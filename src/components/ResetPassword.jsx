import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import banner from "../otherImages/sigupbanner.png"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import PasswordResetService from "../services/passwordResetService";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const navigate = useNavigate();

  const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Minimum 8 characters')
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   'Must contain uppercase, number and special character'
      // )
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      await PasswordResetService.resetPassword(values);
      localStorage.clear();
      Swal.fire({
        icon: 'success',
        title: 'Token Verified Successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
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
            <h4 className='mb-12 fw-bold fs-1'>Change Password</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Reset Your password here
            </p>
          </div>

          {/* Formik Form Starts */}
          <Formik
            initialValues={{ user_id: localStorage.getItem('user_id'), password: ""}}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className='icon-field mb-16'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='solar:lock-password-outline' />
                  </span>
                  <Field
                    type='password' name='password' className='form-control h-56-px bg-neutral-50 radius-12' placeholder='Enter password'
                    required
                  />
                  <ErrorMessage name="password" component="div" className="text-danger mt-2"
                  />
                </div>
                <div className='icon-field mb-16'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='solar:lock-password-outline' />
                  </span>
                  <Field
                    type='password' name='confirmPassword' className='form-control h-56-px bg-neutral-50 radius-12' placeholder='Confirm password'
                    required
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-2"
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

export default ResetPassword;
