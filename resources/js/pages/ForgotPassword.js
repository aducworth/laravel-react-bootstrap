import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import AuthService from '../services';

function ForgotPassword(props) {

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({email: ''});
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState({
    error: false,
    message: '',
  });
  const [success, setSuccess] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({...form, ...{ [name]: value }});

    // If a field has a validation error, we'll clear it
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
      .dispatch(AuthService.resetPassword(form))
      .then((res) => {
        setResponse({
          error: false,
          message: res.message,
        });
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
              <h4>Request Password Reset</h4>

              <div className="card-login card mb-3">
                <div className="card-body">
                  {success && (
                    <div
                      className="alert alert-success text-center"
                      role="alert"
                    >
                      A password reset link has been sent!
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

                      <div className="form-group text-center">
                        <button
                          type="submit"
                          className={classNames('btn btn-primary', {
                            'btn-loading': loading,
                          })}
                        >
                          Send Password Reset Email
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

ForgotPassword.defaultProps = {
  location: {
    state: {
      pathname: '/',
    },
  },
};

ForgotPassword.propTypes = {
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

export default connect(mapStateToProps)(ForgotPassword);
