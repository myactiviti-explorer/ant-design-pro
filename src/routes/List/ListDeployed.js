import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BasicList.less';
import {prettyDate} from '../../utils/utils';
import ReactDOM from 'react-dom';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const { Meta } = Card;

@connect(state => ({
  list: state.list,
}))
export default class ListDeployed extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'list/deployed',
      payload: {
        count: 1,
        pageSize: 5,
      },
    });
  }

  render() {
    const { list: { list2, loading } } = this.props;
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    const search = document.getElementById('search')
    const extraContent = (
      <div className={styles.extraContent}>

        <Search
          id="search"
          className={styles.extraContentSearch}
          placeholder="请输入流程名称"
          enterButton
          onSearch={() => {
            showList(1,list2.pageSize)
          }}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize:list2.pageSize==null?5:list2.pageSize,
      defaultCurrent:1,
      current:list2.pageNo,
      total:list2.totalCount,
      pageSizeOptions:['5','10','20','30','40'],
      onChange:(current, pageSize)=>{
        showList(current, pageSize)
      },
      onShowSizeChange:(page, pageSize)=>{
        showList(1, pageSize)
      },
    };

    const ListContent = ({ data: { businessId, deployment } }) => (
      <div className={styles.listContent}>
        <div>
          <span>Owner</span>
          <p>&nbsp;</p>
        </div>
        <div>
          <span>部署时间</span>
          <p title={moment(deployment.deploymentTime).format('YYYY-MM-DD hh:mm')}>
            {prettyDate(deployment.deploymentTime)}
          </p>
        </div>
      </div>
    );

    const menu = (
      <Menu>
        <Menu.Item>
          <a>转换为可编辑模型</a>
        </Menu.Item>
        <Menu.Item>
          <a>查看流程图</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );
    const showList = (pageNo, pageSize) => {
      this.props.dispatch({
        type: 'list/deployed',
        payload: {
          count: pageNo,
          pageSize: pageSize,
          name: search==null?"":search.value,
        },
      })
    }
    const start = (s) => {
      this.props.dispatch({
        type: 'list/start',
        payload: {
          id: s,
        },
    })}
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
        <img alt="example" src={"/api/listDevelopedImg?id="+s} />
      </Modal>;
      ReactDOM.render(
        <div   width="200">
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
            title="已部署流程"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list2.pageItems}

              renderItem={item => (
                <List.Item
                  actions={[<a onClick={()=>start(item.id)}>启动</a>, <MoreBtn />]}
                >

                  <List.Item.Meta
                    avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" shape="square" size="large"
                    onClick={()=>showImg(item.id,document.getElementById('cool'),item.deployment==null?"":item.deployment.name)}
                    style={{cursor:"pointer"}}
                    title="显图"
                  />}
                    title={<a href="href">{item.key}</a>}
                    description={item.deployment.name + '，关联业务 ' + item.businessId}
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
