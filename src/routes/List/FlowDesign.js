import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Popconfirm, Form, notification, Upload, message, Modal, List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BasicList.less';
import Jsonx from '../../utils/Jsonx';
import {prettyDate} from '../../utils/utils';
import ReactDOM from 'react-dom';
import DCR from '../../utils/DealCommonReturn';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search,TextArea } = Input;
const { Meta } = Card;
const FormItem = Form.Item;
@connect(state => ({
  list: state.list,
}))
export default class FlowDesign extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'list/designing',
      payload: {
        count: 1,
        pageSize: 5,
      },
    });
  }
  render() {
    const { list: { list, loading } } = this.props;
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const search = document.getElementById('search')
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <Button value="new">新建</Button>
          &nbsp;&nbsp;
          <Upload
            action="/api/uploadProcessFile"
            name="Filedata"
            showUploadList={false}
            onChange={
              (info)=>{
                if (info.file.status === 'done') {
                  DCR.deal(info.file.response)
                  paginationProps.onChange(paginationProps.current,paginationProps.pageSize)
                }else if(info.file.status === 'error'){
                  notification.error({
                    message: `请求失败`,
                    description: `上传未成功`,
                  });
                }
              }
            }
            ><Button><Icon>导入</Icon></Button></Upload>
        </RadioGroup>
        <Search
          id="search"
          className={styles.extraContentSearch}
          placeholder="请输入模型名称"
          enterButton
          onSearch={() => {
            showList(1,list.pageSize)
          }}
        />
      </div>
    );
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize:list.pageSize==null?5:list.pageSize,
      defaultCurrent:1,
      current:list.pageNo,
      total:list.totalCount,
      pageSizeOptions:['5','10','20','30','40'],
      onChange:(current, pageSize)=>{
        showList(current, pageSize)
      },
      onShowSizeChange:(page, pageSize)=>{
        showList(1, pageSize)
      },
    };

    const ListContent = ({ data: { owner, createTime, lastUpdateTime, percent, status, businessId } }) => (
      <div className={styles.listContent}>
        <div>
          <span>Owner</span>
          <p>{owner}&nbsp;</p>
        </div>
        <div>
          <span>创建时间</span>
          <p title={moment(createTime).format('YYYY-MM-DD hh:mm')}>
            {prettyDate(createTime)}
          </p>
        </div>
        <div>
          <span>最后修改</span>
          <p title={moment(lastUpdateTime).format('YYYY-MM-DD hh:mm')}>
            {prettyDate(lastUpdateTime)}
          </p>
        </div>
      </div>
    );

    const MyMenu = ({data}) => {
      return(
        <Menu selectable={false} style={{marginLeft:-15, border:0}}>
          <Menu.Item key="1">
            <a onClick={()=>{alert('1:'+data.id)}}>编辑</a>
          </Menu.Item>
          <Menu.Item key="2" >
            <a onClick={()=>showCopy(data,document.getElementById('cool'))}>复制</a>
          </Menu.Item>
          <Menu.Item key="3" >
            <Popconfirm placement="left" overlayStyle={{paddingRight:20}} title={"您希望删除模型 "+data.name+" 么？"} onConfirm={()=>{deleteModel(data.id)}} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
          </Menu.Item>
          <Menu.Item key="4" >
            <a onClick={()=>exportModel(data.id)}>导出</a>
          </Menu.Item>
        </Menu>
      )
    }

    const MoreBtn = (props) => (
      <Dropdown overlay={<MyMenu data={props.process}/>}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const showList = (pageNo, pageSize) => {
      this.props.dispatch({
        type: 'list/designing',
        payload: {
          count: pageNo,
          pageSize: pageSize,
          name: search==null?"":search.value,
        },
      })
    }

    const deploy = (s) => {
      this.props.dispatch({
        type: 'list/doDeploy',
        payload: {
          id: s,
        },
    })}

    const copy = (s,n,d) => {
      this.props.dispatch({
        type: 'list/doCopy',
        payload: {
          id: s,
          name:n,
          description:d,
        },
        callback:()=>{paginationProps.onChange(paginationProps.current,paginationProps.pageSize)},
    })}
    const deleteModel = (s) => {
      this.props.dispatch({
        type: 'list/doDelete',
        payload: {
          id: s,
        },
        callback:()=>{paginationProps.onChange(paginationProps.current,paginationProps.pageSize)},
    })}
    const exportModel = (s) => {
      document.location.href="/api/exportModel?id="+s
    }
    const showImg = (s,n,t) => {
      let visible = true;
      const ref = <Modal
        width="200"
        title={t}
        style={{top:30}}
        visible={visible}
        onOk={()=>{ReactDOM.render(null,n);}}
        onCancel={()=>{ReactDOM.render(null,n);}}
      >
        <img alt="example" src={"/api/listShowImg?id="+s} />
      </Modal>;
      ReactDOM.render(
        <div   width="200">
        {ref}
      </div>
      ,n);
    }
    const showCopy = (s,n) => {
      let visible = true;
      const ref = <Modal
        title={"复制流程 - "+s.name}
        style={{top:30}}
        visible={visible}
        onOk={()=>{
          if((document.getElementById('copyName').value).trim()==""){
            document.getElementById('copyName').focus()
            notification.error({
              message: `请求失败`,
              description: `新复制模型名称为空`,
            });
          }else{
            copy(s.id,document.getElementById('copyName').value,document.getElementById('copyDescription').value);
            ReactDOM.render(null,n);
          }
        }}
        onCancel={()=>{ReactDOM.render(null,n);}}
      >
        <Card bordered={false}>
          <Form hideRequiredMark style={{ marginTop: 8, minWidth:200 }} >
            <FormItem {...formItemLayout} style={{ width: 200 }}
              label="名称"
              help="不能为空"
            >
              <Input placeholder="新复制模型的名称" style={{width: 340}} id="copyName"/>
            </FormItem>
            <FormItem {...formItemLayout} style={{ width: 200 }}
              label="描述"
            >
              <TextArea style={{ minHeight: 100,minWidth: 340 }} placeholder="请输入对新模型的描述" rows={4} id="copyDescription"/>
            </FormItem>
          </Form>
        </Card>
      </Modal>;
      ReactDOM.render(
        <div width="200">
        {ref}
      </div>
      ,n);
    }

    return (
      <PageHeaderLayout>
        <div id="cool">
        </div>
        <div className={styles.standardList}>

          <Card
            className={styles.listCard}
            bordered={false}
            title="流程列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list.pageItems}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={()=>deploy(item.id)}>部署</a>,
                    <MoreBtn process={item} />]
                  }
                >
                  <List.Item.Meta
                    avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" shape="square" size="large"
                      onClick={()=>showImg(item.id,document.getElementById('cool'),item.name)}
                      style={{cursor:"pointer"}}
                      title="显图"
                    />}
                    title={<a href={item.href}>{item.name}</a>}
                    description={!!Jsonx.format(item.metaInfo)?Jsonx.format(item.metaInfo).description:null + '，关联业务 ' + item.businessId}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
