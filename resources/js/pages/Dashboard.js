import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';

function Dashboard(props) {
  const [todo, setTodo] = useState(null);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  const api = '/api/v1/todo';

  useEffect(() => {
    Http.get(`${api}?status=open`)
        .then((response) => {
          const { data } = response.data;
          setData(data);
          setError(false);
        })
        .catch(() => {
          setError('Unable to fetch data.');
        });
  }, []);

  const addTodo = (todo) => {
    Http.post(api, { value: todo })
      .then(response => {
        const newItem = {
          id: response.data.id,
          value: todo,
        };
        setData([newItem, ...data]);
        setTodo(null);
      })
      .catch(() => {
        setError('Sorry, there was an error saving your to do.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(todo);
  };

  const closeTodo = (id) => {
    Http.patch(`${api}/${id}`, { status: 'closed' })
      .then(() => {
        const updatedTodos = data.filter(
          (todo) => todo.id !== id,
        );
        setData(updatedTodos);
      })
      .catch(() => {
        setError('Sorry, there was an error closing your to do.');
      });
  };

  return (
    <div className="container py-5">
      <div className="add-todos mb-5">
        <h1 className="text-center mb-4">Add a To Do</h1>
        <form
          method="post"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="addTodo">Add a New To Do</label>
            <div className="d-flex">
              <input
                id="addTodo"
                name="todo"
                className="form-control mr-3"
                placeholder="Build a To Do app..."
                onChange={event => setTodo(event.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      <div className="todos">
        <h1 className="text-center mb-4">Open To Dos</h1>
        <table className="table table-striped">
          <tbody>
            <tr>
              <th>To Do</th>
              <th>Action</th>
            </tr>
            {data.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.value}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => closeTodo(todo.id)}
                  >
                    Close
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(Dashboard);
