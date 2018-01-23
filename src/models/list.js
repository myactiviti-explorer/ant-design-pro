import { listDeployed,listDesigning,doStart,doDeploy,doCopy,doDelete } from '../services/api';
import Jsonx from '../utils/Jsonx';
import DCR from '../utils/DealCommonReturn';
import { Alert,Card } from 'antd';
import ReactDOM from 'react-dom';
const { Meta } = Card;
export default {
  namespace: 'list',

  state: {
    list: [],
    list2: [],
    loading: false,
  },

  effects: {
    *designing({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = Jsonx.format(yield call(listDesigning, payload));
      yield put({
        type: 'listDesigning',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *deployed({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = Jsonx.format(yield call(listDeployed, payload));
      yield put({
        type: 'listDeployed',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *appendFetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(listDeployed, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *start({ payload,mountNode }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(doStart, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      yield put({
        type: 'showMessage',
        payload: response,
        mountNode: mountNode,
      });
    },
    *doDeploy({ payload,mountNode }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(doDeploy, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      },);
      yield put({
        type: 'showMessage',
        payload: response,
        mountNode: mountNode,
      });
    },
    *doCopy({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(doCopy, payload);
      yield put({
        type: 'showMessage',
        payload: response,
        callback: callback,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *doDelete({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(doDelete, payload);
      yield put({
        type: 'showMessage',
        payload: response,
        callback: callback,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    }
  },

  reducers: {
    listDesigning(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    listDeployed(state, action) {
      return {
        ...state,
        list2: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    showMessage(state, action) {
      DCR.deal(action.payload);
      if(action.callback!=null){
        (action.callback)()
      }
      return {
        ...state,
      }
    },
  },
};
