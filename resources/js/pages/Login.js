import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import ReeValidate from 'ree-validate';
import classNames from 'classnames';
import AuthService from '../services';

function Login(props) {

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({email: '', password: ''});
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState({
    error: false,
    message: '',
  });

  const validator = new ReeValidate({
    email: 'required|email',
    password: 'required|min:6',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({...form, ...{ [name]: value }});

    // If a field has a validation error, we'll clear it when corrected.
    if (name in errors) {
      const validation = validator.errors;
      validator.validate(name, value).then(() => {
        if (!validation.has(name)) {
          delete errors[name];
          setErrors(errors);
        }
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Avoid validation until input has a value.
    if (value === '') {
      return;
    }

    const validation = validator.errors;
    validator.validate(name, value).then(() => {
      if (validation.has(name)) {
        errors[name] = validation.first(name);
        setErrors(errors);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Set response state back to default.
    setResponse({ response: { error: false, message: '' } });

    validator.validateAll(form).then((success) => {
      if (success) {
        setLoading(true);
        submit(credentials);
      }
    });
  };

  const submit = (credentials) => {
    const { dispatch } = props;
    dispatch(AuthService.login(credentials)).catch((err) => {
      const errors = Object.values(err.errors);
      errors.join(' ');
      setResponse({
        error: true,
        message: errors,
      });
      setLoading(false);
    });
  }

  // If user is already authenticated we redirect to entry location.
  const { location: state } = props;
  const { from } = state || { from: { pathname: '/' } };
  const { isAuthenticated } = props;
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-row align-content-center py-5">
        <div className="container">
          <div className="row">
            <div className="section-login col-lg-6 ml-auto mr-auto">
              <h4>Log in to the App</h4>

              <div className="card-login card mb-3">
                <div className="card-body">
                  {response.error && (
                    <div
                      className="alert alert-danger text-center"
                      role="alert"
                    >
                      Credentials were incorrect. Try again!
                    </div>
                  )}

                  <form
                    className="form-horizontal"
                    method="POST"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-group">
                      <label htmlFor="email">
                        Email Address
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
                          onBlur={handleBlur}
                          disabled={loading}
                        />
                      </label>

                      {'email' in errors && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">
                        Password
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
                          onBlur={handleBlur}
                          disabled={loading}
                        />
                      </label>
                      {'password' in errors && (
                        <div className="invalid-feedback">
                          {errors.password}
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
                        Sign In
                      </button>
                    </div>

                    <div className="login-invite-text text-center">
                      No account?
                      {' '}
                      <Link to="/register" href="/register">
                        Register
                      </Link>
                      .
                    </div>
                  </form>
                </div>
              </div>

              <div className="password-reset-link text-center">
                <Link to="/forgot-password" href="/forgot-password">
                  Forgot Your Password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.defaultProps = {
  location: {
    state: {
      pathname: '/',
    },
  },
};

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    state: {
      pathname: PropTypes.string,
    },
  }),
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(Login);
