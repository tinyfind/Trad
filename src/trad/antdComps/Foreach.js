import { List } from 'antd';
import {GComp} from "../core/gComp";
import Button from './Button';

const defaultProps = {

}

export default (array,content)=>{
    content = catchChildren(content)


}

// (Array,fun)
// (config,fun)

Foreach([1,2,3],(item)=>{
    Button(item)
    Button(item)
    Button(item)
    Button(item)
})

// List({data:[1,2,3]}){
//      Flex{
//          Text('>>>')
//      }
// }