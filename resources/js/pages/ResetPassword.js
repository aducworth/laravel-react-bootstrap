import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ReeValidate from 'ree-validate';
import classNames from 'classnames';
import AuthService from '../services';

function ResetPassword(props) {

  const getResetId = () => {
    const params = new URLSearchParams(props.location.search);
    if (params.has('id')) {
      return params.get('id');
    }
    return '';
  }

  const getResetToken = () => {
    const params = new URLSearchParams(props.location.search);
    if (params.has('token')) {
      return params.get('token');
    }
    return '';
  }

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: getResetId(),
    token: getResetToken(),
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState({
    error: false,
    message: '',
  });
  const [success, setSuccess] = useState(false);


  // @TODO Password confirmation validation.
  const validator = new ReeValidate({
    password: 'required|min:6',
    password_confirmation: 'required|min:6',
    id: 'required',
    token: 'required',
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
    const validation = validator.errors;

    // Avoid validation until input has a value.
    if (value === '') {
      return;
    }

    validator.validate(name, value).then(() => {
      if (validation.has(name)) {
        errors[name] = validation.first(name);
        setErrors(errors);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    props
      .dispatch(AuthService.updatePassword(form))
      .then((res) => {
        setLoading(false);
        setSuccess(true);
        setResponse({
          error: false,
          message: res.message,
        });
      })
      .catch((err) => {
        const errors = Object.values(err.errors);
        errors.join(' ');
        setLoading(false);
        setResponse({
          error: true,
          message: errors,
        });
      });
  };

  // If user is already authenticated we redirect to entry location.
  const { from } = props.location.state || { from: { pathname: '/' } };
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
              <h4>Password Reset</h4>

              <div className="card-login card mb-3">
                <div className="card-body">
                  {success && (
                    <div
                      className="alert alert-success text-center"
                      role="alert"
                    >
                      Your password has been reset!
                    </div>
                  )}

                  {response.error && (
                    <div
                      className="alert alert-danger text-center"
                      role="alert"
                    >
                      {response.message}
                    </div>
                  )}

                  {!success && (
                    <form
                      className="form-horizontal"
                      method="POST"
                      onSubmit={handleSubmit}
                    >
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
                          onBlur={handleBlur}
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
                          onBlur={handleBlur}
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
                          Reset Password
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ResetPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(ResetPassword);
