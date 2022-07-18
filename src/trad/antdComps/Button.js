import { Button } from 'antd';
import {GComp} from "../core/gComp";


const defaultProps = {
    block:false,
    danger:false,
    disabled:false,
    icon:'',
    loading:false,
    shape: 'default',
    size:'middle',
    type:'default'
}


export default GComp(Button)
