import React, { useState } from 'react'
import { Modal, Button, notification, Form, Input, Radio } from 'antd'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks'


const UPDATE_USER = gql`
  mutation UpdateUser($_id:String,$username:String,$sex:String,$phone:String,$avatar:String,$realName:String,$isAdmin:Boolean){
    updateUser(_id:$_id,username:$username,sex:$sex,phone:$phone,avatar:$avatar,realName:$realName,isAdmin:$isAdmin){
      success
      msg
    }
  }
`

const openNotificationWithIcon = ({ type = 'success', title = 'tips', content = '' }) => {
  notification[type]({
    message: title,
    description: content,
    placement: 'bottomRight'
  });
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!',
  },
  number: {
    range: 'Must be between ${min} and ${max}',
  },
}

export default ({ item, refetch, ...otherProps }) => {
  console.log(item)
  const [visible, setVisible] = useState(false)

  const [updateUser] = useMutation(UPDATE_USER)
  const updateUserFun = async params => {// 修改用户信息
    const res = await updateUser({ variables: { ...params } })
    const { updateUser: result } = res.data
    if (!result?.success) return openNotificationWithIcon({ type: 'error', content: result?.msg || 'server error' })
    openNotificationWithIcon({ content: 'successful' })
    refetch()
    setVisible(false)
  }

  const onFinish = (values) => {
    console.log(values)
    updateUserFun(values)
  }

  return (
    <>
      <Button type="primary" size='small' onClick={() => setVisible(true)}>edit</Button>
      <Modal
        title={`${!item ? 'add' : 'edit'} user`}
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={{ ...item }}
          size={'middle'}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item label="username" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="money" name="money" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="phone" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="realName" name="realName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="sex" name="sex">
            <Radio.Group>
              <Radio.Button value='0'>alien</Radio.Button>
              <Radio.Button value='1'>GG</Radio.Button>
              <Radio.Button value='2'>MM</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="isAdmin" name="isAdmin">
            <Radio.Group>
              <Radio.Button value={true}>Yes</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}