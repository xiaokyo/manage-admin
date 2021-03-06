import React, { useState } from 'react'
import { Table, Input, Tag, Select, Button, Modal, notification } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment'
import { To } from 'utils'

// style
import './style.less'

const { confirm } = Modal
const { Search } = Input
const { Option } = Select

const QUERY_ORDERS = gql`
  query Orders($orderId:String,$status:Int,$payFor:Int,$limit:Int,$skip:Int){
    orders(orderId:$orderId,payFor:$payFor,status:$status,limit:$limit,skip:$skip){
      _id
      orderId
      user{
        _id
        username
      }
      payFor
      payBank
      payAmount
      payRealName
      status
      money
      remark
      createDate
    }
  }
`;

const UPDATE_ORDER = gql`
mutation UpdateOrder($orderId:String!,$status:Int!){
  updateOrder(orderId:$orderId,status:$status){
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

const payObj = {// 支付类型
  0: 'bank',
  1: 'alipay',
  2: 'wepay'
}

export default props => {

  const [params, setParams] = useState({ orderId: '', limit: 100, skip: 0 })
  const { loading, error, data, refetch } = useQuery(QUERY_ORDERS, {
    variables: { ...params }
  })

  const [updateOrder] = useMutation(UPDATE_ORDER)
  const updateOrderStatus = async ({ orderId }, status) => {// 修改状态  只可以操作一次
    const [err, res] = await To(updateOrder({ variables: { orderId, status } }))
    console.log(err)
    if (err) return openNotificationWithIcon({ type: 'error', content: err.message || 'server error' })
    const { updateOrder: result, errors } = res.data
    if (!result?.success) return openNotificationWithIcon({ type: 'error', content: result?.msg || 'server error' })

    refetch()
    openNotificationWithIcon({ content: 'successful' })
  }
  const openConfrimUpdate = (item, status) => {// 打开确认弹窗
    confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'are you sure?',
      okText: 'submit',
      cancelText: 'cancel',
      onOk: () => updateOrderStatus(item, status)
    })
  }

  const { tableProps, handleTableChange } = useMyTable()

  // 更改某一个值触发重新请求
  const refresh = (key, val) => {
    setParams({ ...params, [key]: val !== '' ? val : undefined })
    refetch()
  }

  const columns = [
    {
      title: 'orderId',
      dataIndex: 'orderId'
    },
    {
      title: 'userName',
      dataIndex: 'user',
      render: user => user?.username || ''
    },
    {
      title: 'payFor',
      dataIndex: 'payFor',
      render: val => payObj[val]
    },
    {
      title: 'payBank',
      dataIndex: 'payBank'
    },
    {
      title: 'payAmount',
      dataIndex: 'payAmount'
    },
    {
      title: 'payRealName',
      dataIndex: 'payRealName'
    },
    {
      title: 'status',
      dataIndex: 'status',
      render: val => {
        const obj = {
          '0': { name: 'pedding', color: '' },
          '1': { name: 'pass', color: '#87d068' },
          '-1': { name: 'fail', color: '#f50' }
        }
        const item = obj[val]
        return <Tag color={item.color}>{item.name}</Tag>
      }
    },
    {
      title: 'money',
      dataIndex: 'money',
      render: val => `￥${val}`
    },
    {
      title: 'remark',
      dataIndex: 'remark'
    },
    {
      title: 'createDate',
      dataIndex: 'createDate',
      render: val => moment(parseInt(val)).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'operation',
      render: (val, records) => {
        const PassBtn = () => <Button type="primary" size='small' onClick={() => openConfrimUpdate(records, 1)}>pass</Button>
        const RejectBtn = () => <Button type="danger" size='small' onClick={() => openConfrimUpdate(records, -1)}>reject</Button>
        let res = '--'
        if (records.status === 0) res = <><PassBtn /><RejectBtn /></>
        if (records.status === -1) res = <PassBtn />
        return res
      }
    }
  ]

  if (error) return `Error! ${error.message}`
  return (
    <>
      <div styleName="filter">
        <Select defaultValue={''} style={{ width: 150, marginRight: 15 }} onChange={val => refresh('status', val)}>
          <Option value={''}>select order status</Option>
          <Option value={0}>Pedding</Option>
          <Option value={1}>Pass</Option>
          <Option value={-1}>Fail</Option>
        </Select>
        <Select defaultValue={''} style={{ width: 150, marginRight: 15 }} onChange={val => refresh('payFor', val)}>
          {/* 0 银行转账  1 支付宝  2 微信 */}
          <Option value={''}>select payType</Option>
          <Option value={0}>bank</Option>
          <Option value={1}>alipay</Option>
          <Option value={2}>wepay</Option>
        </Select>
        <Search placeholder="search orderId" style={{ maxWidth: 200 }} onSearch={val => refresh('orderId', val)} enterButton />
      </div>
      <Table
        {...tableProps}
        columns={columns}
        rowKey={record => record._id}
        loading={loading}
        dataSource={data?.orders ?? []}
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