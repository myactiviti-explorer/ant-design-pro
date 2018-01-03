import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BasicList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;


@connect(state => ({
  list: state.list,
}))
export default class ListDeployed extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'list/deployed',
      payload: {
        count: 1,
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

    const extraContent = (
      <div className={styles.extraContent}>

        <Search
          className={styles.extraContentSearch}
          placeholder="请输入"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
      defaultCurrent:1,
      current:list2.pageNo,
      total:list2.totalCount,
      onChange:(e)=>{this.props.dispatch({
        type: 'list/deployed',
        payload: {
          count: e,
        },
      })}
    };

    const ListContent = ({ data: { owner, createdAt, percent, status, businessId } }) => (
      <div className={styles.listContent}>
        <div>
          <span>Owner</span>
          <p></p>
        </div>
        <div>
          <span>部署时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD hh:mm')}</p>
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

    return (
      <PageHeaderLayout>
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
              dataSource={list2.pageItems}

              renderItem={item => (
                <List.Item
                  actions={[<a href="">启动</a>, <MoreBtn />]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" shape="square" size="large" />}
                    title={<a href={item.key}>{item.key}</a>}
                    description={item.id + '，关联业务 ' + item.businessId}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
    // return null;
  }
}
