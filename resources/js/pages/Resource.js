import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';

import { Button, Icon, IconButton, Table } from 'rsuite';

import { Loading } from '../components/common/Loading';
import { ResourceForm } from '../components/forms/ResourceForm';

const defaultForm = {
  value : ''
};

function Resource(props) {

  // state
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  const api = `/api/v1/${props.match.params.resource}`;

  useEffect(() => {
    setLoading(true);
    Http.get(`${api}`)
        .then((response) => {
          const { data } = response.data;
          setData(data);
          setError(false);
          setLoading(false);
        })
        .catch(() => {
          setError('Unable to fetch data.');
          setLoading(false);
        });
  }, []);

  // const addTodo = (todo) => {
  //   Http.post(api, { value: todo })
  //     .then(response => {
  //       const newItem = {
  //         id: response.data.id,
  //         value: todo,
  //       };
  //       setData([newItem, ...data]);
  //       setTodo(null);
  //     })
  //     .catch(() => {
  //       setError('Sorry, there was an error saving your to do.');
  //     });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   addTodo(todo);
  // };
  //
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

  const renderData = () => {
    return (
      <Table
          autoHeight
          data={data}
          onRowClick={data => {
            console.log(data);
          }}
        >
          <Table.Column flexGrow={1}>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.Cell dataKey="id" />
          </Table.Column>

          <Table.Column flexGrow={2}>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.Cell dataKey="value" />
          </Table.Column>

          <Table.Column className="text-right" flexGrow={2}>
            <Table.HeaderCell>Action</Table.HeaderCell>

            <Table.Cell className="text-right">
              {rowData => {
                function handleAction() {
                  alert(`id:${rowData.id}`);
                }
                return (
                  <span>
                    <Button size="xs" color="blue" onClick={() => setForm(rowData)}> Edit </Button>{' '}
                    <Button size="xs" color="red" onClick={handleAction}> Remove </Button>
                  </span>
                );
              }}
            </Table.Cell>
          </Table.Column>
        </Table>
    );
  };

  return (
    <div className="container py-5">

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {loading ? <Loading /> : (
        <div className="todos">
          <h1>ToDos <span className="text-muted">{data.length}</span></h1>
          <div className="text-right">
            <IconButton
              appearance="primary"
              icon={<Icon icon="plus" />}
              placement="left"
              onClick={() => setForm(defaultForm)}
            >
              Add
            </IconButton>
          </div>
          {renderData()}
          <ResourceForm
            data={form}
            showForm={form ? true : false}
            closeForm={() => setForm(null)}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(Resource);
