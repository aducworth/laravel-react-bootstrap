import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Http from '../Http';

function Archive(props) {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [apiMore, setApiMore] = useState('');
  const [moreLoaded, setMoreLoaded] = useState(false);
  const [error, setError] = useState(false);

  const api = '/api/v1/todo';

  useEffect(() => {
    Http.get(api)
      .then((response) => {
        const { data } = response.data;
        const apiMore = response.data.links.next;
        setData(data);
        setApiMore(apiMore);
        setLoading(false);
        setError(false);
      })
      .catch(() => {
        setError('Unable to fetch data.');
      });
  }, []);

  const loadMore = () => {
    setLoading(true);
    Http.get(apiMore)
      .then((response) => {
        const apiMore = response.data.links.next;
        setData([...data, ...response.data]);
        setApiMore(apiMore);
        setLoading(false);
        setMoreLoaded(true);
        setError(false);
      })
      .catch(() => {
        setError('Unable to fetch data.');
      });
  };

  const deleteTodo = (id) => {
    Http.delete(`${api}/${id}`)
      .then((response) => {
        if (response.status === 204) {
          const updatedTodos = data.filter(
            (todo) => todo.id !== id,
          );
          setData(updatedTodos);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">To Do Archive</h1>

      {error && (
        <div className="text-center">
          <p>{error}</p>
        </div>
      )}

      <table className="table">
        <tbody>
          <tr>
            <th>Time</th>
            <th>To Do</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          {data.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.created_at}</td>
              <td>{todo.value}</td>
              <td>{todo.status}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {apiMore && (
        <div className="text-center">
          <button
            className={classNames('btn btn-primary', {
              'btn-loading': loading,
            })}
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}

      {apiMore === null && moreLoaded === true && (
        <div className="text-center">
          <p>Everything loaded.</p>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(Archive);
