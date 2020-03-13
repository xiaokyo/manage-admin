import React from 'react'
import { Form, Input, Button, Checkbox, Modal } from 'antd'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { To, setStorage } from 'utils'


const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 4,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
}

const SIGNING = gql`
  mutation login($email:String!,$password:String!){
    login(email:$email,password:$password){
      code
      accessToken
      user{
        _id
      }
    }
  }
`;

export default props => {
  const [login] = useMutation(SIGNING)

  const onFinish = async values => {
    console.log('Success:', values)
    const { email, password } = values
    const [err, res] = await To(login({ variables: { email, password } }))
    const { data } = res
    if (err || data.login.code !== 1) return Modal.error({ content: 'please check your username or password' })

    const { accessToken, user } = data.login
    setStorage('accessToken', accessToken)

    Modal.success({
      content: 'successful',
      onOk: function () {
        location.href = '/'
      }
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}