import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import banner from "../otherImages/sigupbanner.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, registerUser } from '../../src/store/slices/authSlice';
import * as Yup from 'yup';

const SignUpLayer = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
      localStorage.clear();
    }, [dispatch]);
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);
  const registerSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Too short!')
      .max(50, 'Too long!')
      .required('Required'),
    username: Yup.string()
      .min(3, 'Too short!')
      .max(20, 'Too long!')
      .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores')
      .required('Required'),
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
    password: Yup.string()
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   'Must contain uppercase, number and special character'
      // )
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
    terms: Yup.boolean()
      .oneOf([true], 'You must accept the terms')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const { confirmPassword, terms, ...registrationData } = values;
    const resultAction = await dispatch(registerUser(registrationData));

    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/all-packages');
    }
    setSubmitting(false);
  };

  return (
    <section className='auth bg-base d-flex'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img
            className="w-100"
            src={banner}
            alt=''
            style={{ objectFit: "cover", objectPosition: "bottom", height: "100%" }}
          />
        </div>
      </div>

      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link to='/' className='mb-40 max-w-290-px'>
              <img src='assets/images/logo.png' alt='' />
            </Link>
            <h4 className='mb-12 fw-bold fs-1'>Sign Up</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Create your account to get started
            </p>
          </div>

          {error && (
            <div className="alert alert-danger mb-4">
              {typeof error === 'string' ? error : 'Registration failed'}
            </div>
          )}

          <Formik
            initialValues={{
              name: '',
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
              terms: false
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Full Name Field */}
                <div className='icon-field mb-16'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='f7:person' />
                  </span>
                  <Field
                    type='text'
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    placeholder='Full Name'
                    name='name'
                  />
                  <ErrorMessage name="name" component="div" className="text-danger mt-2" />
                </div>

                {/* Email Field */}
                <div className='icon-field mb-16'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='mage:email' />
                  </span>
                  <Field
                    type='email'
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    placeholder='Email'
                    name='email'
                  />
                  <ErrorMessage name="email" component="div" className="text-danger mt-2" />
                </div>

                {/* Username Field */}
                <div className='icon-field mb-16'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='mdi:account' />
                  </span>
                  <Field
                    type='text'
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    placeholder='Username'
                    name='username'
                  />
                  <ErrorMessage name="username" component="div" className="text-danger mt-2" />
                </div>

                {/* Password Field */}
                <div className='icon-field mb-16'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='solar:lock-password-outline' />
                  </span>
                  <Field
                    type='password'
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    placeholder='Password'
                    name='password'
                  />
                  <ErrorMessage name="password" component="div" className="text-danger mt-2" />
                </div>

                {/* Confirm Password Field */}
                <div className='icon-field mb-20'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='solar:lock-password-outline' />
                  </span>
                  <Field
                    type='password'
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    placeholder='Confirm Password'
                    name='confirmPassword'
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-2" />
                </div>

                {/* Terms Checkbox */}
                <div className='mb-20'>
                  <div className='form-check style-check d-flex align-items-start'>
                    <Field
                      type='checkbox'
                      name='terms'
                      id='terms'
                      className='form-check-input border border-neutral-300 mt-4'
                    />
                    <label htmlFor='terms' className='form-check-label text-sm ms-2'>
                      <h6 className="fs-6 primaryColor mt-1">I agree to the Terms & Conditions and Privacy Policy.</h6>
                      By checking this box, you confirm that you have read and accepted our Terms & Conditions and Privacy Policy.
                    </label>
                  </div>
                  <ErrorMessage name="terms" component="div" className="text-danger mt-2" />
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  className='btn bg-primary py-16 w-100 radius-12 mt-32'
                  disabled={loading || isSubmitting}
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>

                {/* Social Login Section */}
                {/* <div className='mt-32 center-border-horizontal text-center'>
                  <span className='bg-base z-1 px-4 fw-bold'>Or Continue With</span>
                </div>
                <div className='mt-32 d-flex align-items-center gap-3 justify-content-center'>
                  <button
                    type='button'
                    className='fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
                  >
                    <Icon
                      icon='logos:google-icon'
                      className='text-primary-600 text-xl line-height-1'
                    />
                    Google
                  </button>
                </div> */}

                {/* Login Link */}
                <div className='mt-32 text-center text-sm'>
                  <p className='mb-0'>
                    Already have an account?{" "}
                    <Link to='/' className='primaryColor fw-semibold'>
                      Sign In
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

export default SignUpLayer;