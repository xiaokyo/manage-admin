import React, { useState } from 'react'
import { Table, Input, Button, notification } from 'antd'
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment'

// style
import './style.less'

// components
import EditUser from './components/editUser'

const { Search } = Input

const QUERY_USERS = gql`
  query Users($username:String,,$limit:Int,$skip:Int){
    users(username:$username,limit:$limit,skip:$skip){
      _id
      username
      isAdmin
      money
      sex
      email
      phone
      realName
      createDate
    }
  }
`;

export default props => {

  const [params, setParams] = useState({ username: '', limit: 100, skip: 0 })
  const { loading, error, data, refetch } = useQuery(QUERY_USERS, {
    variables: { ...params }
  })

  const { tableProps, handleTableChange } = useMyTable()

  // 更改某一个值触发重新请求
  const refresh = (key, val) => {
    setParams({ ...params, [key]: val })
    refetch()
  }

  const columns = [
    {
      title: 'username',
      dataIndex: 'username'
    },
    {
      title: 'isAdmin',
      dataIndex: 'isAdmin',
      render: val => val ? 'yes' : 'no'
    },
    {
      title: 'money',
      dataIndex: 'money',
      render: val => `￥${val}`
    },
    {
      title: 'sex',
      dataIndex: 'sex',
      render: val => {
        const obj = {
          0: 'alien',
          1: 'GG',
          2: 'MM'
        }

        return obj[val]
      }
    },
    {
      title: 'email',
      dataIndex: 'email'
    },
    {
      title: 'phone',
      dataIndex: 'phone'
    },
    {
      title: 'realName',
      dataIndex: 'realName'
    },
    {
      title: 'createDate',
      dataIndex: 'createDate',
      render: val => moment(parseInt(val)).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'operation',
      render: (val, records) => (
        <>
          <EditUser key={records._id} refetch={refetch} item={records} />
          <Button type="danger" size='small'>delete</Button>
        </>
      )
    }
  ]

  if (error) return `Error! ${error.message}`
  return (
    <>
      <div styleName="filter">
        {/* <Select defaultValue={0} style={{ width: 120, marginRight: 15 }} onChange={val => refresh('status', val)}>
          <Option value={0}>Pedding</Option>
          <Option value={1}>Pass</Option>
          <Option value={-1}>Fail</Option>
        </Select> */}
        <Search placeholder="search username" style={{ maxWidth: 200 }} onSearch={val => refresh('username', val)} enterButton />
      </div>
      <Table
        {...tableProps}
        columns={columns}
        rowKey={record => record._id}
        loading={loading}
        dataSource={data?.users ?? []}
        onChange={handleTableChange}
      />
    </>
  )
}


const useMyTable = () => {
  const [tableProps, setTableProps] = useState({
    pagination: {
      current: 1,
      pageSize: 12
    }
  })

  const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...tableProps.pagination }
    pager.current = pagination.current
    setTableProps({ ...tableProps, pagination: { ...tableProps.pagination, ...pager } })
  }

  return { tableProps, handleTableChange }
}