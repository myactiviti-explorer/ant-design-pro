import { queryFakeList } from '../services/api';
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
        type: 'queryList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading2',
        payload: true,
      });
      const response = Jsonx.format(yield call(queryFakeList, payload));
      yield put({
        type: 'queryList2',
        payload: response,
      });
      yield put({
        type: 'changeLoading2',
        payload: false,
      });
    },
    *appendFetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryFakeList, payload);
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
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
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
    queryList2(state, action) {
      return {
        ...state,
        list2: action.payload,
      };
    },
    changeLoading2(state, action) {
      return {
        ...state,
        loading2: action.payload,
      };
    },
  },
};
