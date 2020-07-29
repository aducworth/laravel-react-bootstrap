import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import classNames from 'classnames';
import AuthService from '../services';

function Register(props) {

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState({
    error: false,
    message: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({...form, ...{ [name]: value }});

    // If a field has a validation error, we'll clear it when corrected.
    if (name in errors) {
      setErrors({...errors, ...{[name]: null}});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Set response state back to default.
    setResponse({ response: { error: false, message: '' } });
    setLoading(true);

    props
      .dispatch(AuthService.register(form))
      .then(() => {
        setLoading(false);
        setSuccess(true);
      })
      .catch((err) => {
        const errors = Object.values(err.errors);
        errors.join(' ');
        setResponse({
          error: true,
          message: errors,
        });
        setLoading(false);
      });
  };

  // If user is already authenticated we redirect to dashboard.
  if (props.isAuthenticated) {
    return <Redirect to="/" replace />;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-row align-content-center py-5">
        <div className="container">
          <div className="row">
            <div className="section-login col-lg-6 ml-auto mr-auto">
              <h4>Register for the App</h4>

              <div className="card-login card mb-3">
                <div className="card-body">
                  {response.error && (
                    <div
                      className="alert alert-danger text-center"
                      role="alert"
                    >
                      {response.message}
                    </div>
                  )}

                  {success && (
                    <div
                      className="alert alert-success text-center"
                      role="alert"
                    >
                      Registration successful.
                      <br />
                      <Link to="/" href="/">
                        Please log in with your new email and password.
                      </Link>
                    </div>
                  )}

                  {!success && (
                    <form
                      className="form-horizontal"
                      method="POST"
                      onSubmit={handleSubmit}
                    >
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          id="name"
                          type="name"
                          name="name"
                          className={classNames('form-control', {
                            'is-invalid': 'name' in errors,
                          })}
                          placeholder="Enter name"
                          required
                          onChange={handleChange}
                          disabled={loading}
                        />

                        {'name' in errors && (
                          <div className="invalid-feedback">
                            {errors.name}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          className={classNames('form-control', {
                            'is-invalid': 'email' in errors,
                          })}
                          placeholder="Enter email"
                          required
                          onChange={handleChange}
                          disabled={loading}
                        />

                        {'email' in errors && (
                          <div className="invalid-feedback">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          id="password"
                          type="password"
                          className={classNames('form-control', {
                            'is-invalid': 'password' in errors,
                          })}
                          name="password"
                          placeholder="Enter password"
                          required
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {'password' in errors && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="password_confirmation">
                          Password Confirmation
                        </label>
                        <input
                          id="password_confirmation"
                          type="password"
                          className={classNames('form-control', {
                            'is-invalid': 'password_confirmation' in errors,
                          })}
                          name="password_confirmation"
                          placeholder="Confirm password"
                          required
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {'password_confirmation' in errors && (
                          <div className="invalid-feedback">
                            {errors.password_confirmation}
                          </div>
                        )}
                      </div>

                      <div className="form-group text-center">
                        <button
                          type="submit"
                          className={classNames('btn btn-primary', {
                            'btn-loading': loading,
                          })}
                        >
                          Register
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {!success && (
                <div className="password-reset-link text-center">
                  <Link to="/" href="/">
                    Already registered? Log in.
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Register.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(Register);
