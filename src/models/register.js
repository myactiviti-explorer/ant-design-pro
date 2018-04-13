import { fakeRegister, registerCheckEmail, registerSubmit, } from '../services/api';
import { routerRedux } from 'dva/router';
import DCR from '../utils/DealCommonReturn';
export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *fakeRegister(_, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeRegister);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *checkEmail({ payload }, { call, put }) {
      const response = yield call(registerCheckEmail, payload);
      yield put({
        type: 'registerCheckEmail',
        payload: response,
        callback: payload.callback,
      });
    },
    *submit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(registerSubmit, payload);
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
      if(response.RetCode==='1'){
        yield put(routerRedux.push({
          pathname: '/user/register-result',
          query:{
            email: payload.email
          }
        }));
      }else{
        yield put({
          type: 'showMessage',
          payload: response,
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
    registerCheckEmail(state, action) {
      if(action.payload.RetCode==='1'){
        action.callback();
      }else{
        action.callback(action.payload.RetVal);
      }
      return {
        ...state,
      }
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
