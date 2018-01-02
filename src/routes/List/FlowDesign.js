import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BasicList.less';
import Jsonx from '../../utils/Jsonx';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(state => ({
  list: state.list,
}))
export default class BasicList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'list/designing',
      payload: {
        count: 1,
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

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="new">新建</RadioButton>
          <RadioButton value="import">导入</RadioButton>
        </RadioGroup>
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
      current:list.pageNo,
      total:list.totalCount,
      onChange:(e)=>{this.props.dispatch({
        type: 'list/designing',
        payload: {
          count: e,
        },
      })}
    };

    const ListContent = ({ data: { owner, createTime, lastUpdateTime, percent, status, businessId } }) => (
      <div className={styles.listContent}>
        <div>
          <span>Owner</span>
          <p>{owner}</p>
        </div>
        <div>
          <span>创建时间 {moment(createTime).format('YYYY-MM-DD hh:mm')}</span>
          <p>最后修改 {moment(lastUpdateTime).format('YYYY-MM-DD hh:mm')}</p>
        </div>
      </div>
    );

    const menu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>复制</a>
        </Menu.Item>
        <Menu.Item>
          <a>删除</a>
        </Menu.Item>
        <Menu.Item>
          <a>导出</a>
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
              dataSource={list.pageItems}
              renderItem={item => (
                <List.Item
                  actions={[<a>部署</a>, <MoreBtn />]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" shape="square" size="large" />}
                    title={<a href={item.href}>{item.name}</a>}
                    description={Jsonx.format(item.metaInfo).name + '，关联业务 ' + item.businessId}
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
