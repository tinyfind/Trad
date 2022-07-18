/*
 * @Author: dong 
 * @Date: 2022-07-17 16:50:01
 * @LastEditTime: 2022-07-17 19:52:02
 * @Description: formable
 */

/**
 * 什么是formable 
 * formable 是 form 构建 formData 的响应工具
 * 通过设置对应的 schema 即可是表单数据具有响应式
 * 支持校验
 */

// 支持 对象， 二维数组

// compute 可读 可写 更改原数据
// watch 表示原数据不存在此值 不会更改数据
// 或者自定义 {get(){},set(){},valid(){}}

// $ 表示会找层级的数据

// shema 顺序表示优先级

// compute => {getddfd}

// 对于对象
const schema = {
    intruduce: compute($ => `name:${$.name}age:${$.age}`, ['name', 'age']),
    englishIntrud: watch($ => $.intruduce),
    myIntruduce: compute($ => $.englishIntrud + 'dd', ['intruduce']),
    third: watch($ => $.englishIntrud)
}



// dependencies -> {prop:getter()}


function getDepend(schema) {
    const computes = {}
    const watchs = {}
    for (let prop in schema) {
        if (schema[prop].type == 'compute') {
            schema[prop].deps.forEach(depKey => {
                computes[depKey] = computes[depKey] || {}
                computes[depKey][prop] = schema[prop].getter
            })
        } else if (schema[prop].type == 'watch') {
            watchs[prop] = schema[prop]
        }
    }
    return {
        computes,
        watchs
    }
}

// 对于数组 即表格数据
const schema = {
    name: 'dong',
    age: 10,
    hasFile: "$.fileList.length"
    fileList: {
        allowAdd: $ => $.childList.length > 4,
        allowDelete: $ => $.childList.length > 0,
        childList: {
            file: $ => $.name
        }
    },
    intruduce: compute("$name+$age")
}

const schema = {
    price: $ => $.total / $.number,
    number: $ => $.total / $.price,
    total: $ => $.price * $.number,
}

function setConfig(config, schema) {
    const {computes,watchs} = getDepend(schema)
    config = {
        get(target, prop, self) {
            if (Object.keys(watchs).includes(prop)) {
                return watchs[prop](self)
            }
            return target[prop]
        }
        set(target, prop, value, self) {
            
            if(Object.keys(watchs).includes(prop)) return


            target[prop] = value
            Object.keys(computes[prop])?.forEach(item => {
                self[item] = computes[prop].getter(target)
            })
            return true
        }
    }
}

function useForm(data, schema) {

    proxyData = new Proxy(data, config)
}


// proxy


// schema
// 