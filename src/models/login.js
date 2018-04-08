import { routerRedux } from 'dva/router';
import { fakeAccountLogin, loginTest } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(routerRedux.push('/user/login'));
    },
    *test({ payload }, { call, put }) {
      const response = yield call(loginTest, payload);
      yield put({
        type: 'loginTest',
        payload: response,
        callback: payload.callback,
      });
      // payload.callback('cool')
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
    loginTest(state, action) {
      if(action.payload.flag){
        action.callback();
      }else{
        action.callback(action.payload.message);
      }
    }
  },
};
