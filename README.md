<!--
 * @Author: dong 2710732812@qq.com
 * @Date: 2022-07-18 10:14:08
 * @LastEditors: dong 2710732812@qq.com
 * @LastEditTime: 2022-07-18 11:08:36
 * @FilePath: \trad_callback\README.md
-->
# **Trad Callback Version**  (回调函数版本)

## 启动
- npm install
- npm start
## 进度
- 现已支持 antDesign 及 其它 react组件 库
- 目前正在进行组件重构

## 使用
- GComp 
    - 方法支持对原生标签或者react组件 转换为 **Trad** 组件
    ```javascript
        import {Card} from 'antd'
        const MyCard = GComp(Card)
    ```
- GView 
    - 生成规范 view Trad 组件
    ```javascript
    // 
    const MyComp = GView(({name='dong'})=>{
        const [state,setState] = useState([1,2,3])

        Card({title:name},()=>{
            ForEach([state],(item,index)=>{
                Tag(index)
                Button(item,onclick=()=>{

                })
            })
        })
    })
    ```