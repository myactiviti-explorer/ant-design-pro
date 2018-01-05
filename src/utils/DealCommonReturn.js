import { Alert } from 'antd';
import ReactDOM from 'react-dom';
function deal(mountNode,payload) {
  let type = "";
  if(payload.RetCode == null){
    return;
  }
  if(payload.RetCode == "1"){
    type = "success";
  } else if(payload.RetCode == "0" || payload.RetCode == "2"){
    type = "error";
  }
  ReactDOM.render(
    <Alert message={payload.RetVal} type={type} showIcon />
  , mountNode);
}

export default {
  deal,
};
