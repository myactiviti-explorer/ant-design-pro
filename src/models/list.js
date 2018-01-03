import { listDeployed } from '../services/api';
import { listDesigning } from '../services/api';
import Jsonx from '../utils/Jsonx';

export default {
  namespace: 'list',

  state: {
    list: [],
    list2: [],
    loading: false,
    loading2: false,
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
  },
};
