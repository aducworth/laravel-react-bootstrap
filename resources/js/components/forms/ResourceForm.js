import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Drawer, Form, FormGroup, FormControl, ControlLabel, HelpBlock } from 'rsuite';

export const ResourceForm = ({data, closeForm, showForm}) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaving(true);
  };

  useEffect(() => {
    setFormData(data);
  }, [data]);

  console.log('formData', formData)

  return (
    <Drawer
      show={showForm}
      onHide={closeForm}
    >
      <Drawer.Header>
        <Drawer.Title>{formData && formData.id ? 'Edit ToDo' : 'Create ToDo'}</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
      <Form fluid onSubmit={handleSubmit}>
        <FormGroup>
          <ControlLabel>Username</ControlLabel>
          <FormControl name="name" />
          <HelpBlock>Required</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Email</ControlLabel>
          <FormControl name="email" type="email" />
          <HelpBlock tooltip>Required</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Password</ControlLabel>
          <FormControl name="password" type="password" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Textarea</ControlLabel>
          <FormControl rows={5} name="textarea" componentClass="textarea" />
        </FormGroup>
      </Form>
      </Drawer.Body>
      <Drawer.Footer>
        <Button onClick={closeForm} appearance="subtle">Cancel</Button>
        <Button
          onClick={handleSubmit}
          appearance="primary"
          loading={saving}
        >
          Submit
        </Button>
      </Drawer.Footer>
    </Drawer>
  );
};
