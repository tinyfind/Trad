import {getType} from '.'
import { catchChildren } from '../core/gComp'


const basicTypes =  ['number','string','boolean','null','undefined']

const hasTypeOf = object=>object.hasOwnProperty('$$typeof')

function parseParams(args){
    if(args.length>2) throw 'params must < 2'
    if(args.length == 0) return {config:{}}
    let config = args[0]
    let content = args[1]
    if(args.length == 1){
        if((getType(config) === 'object')){
            if(hasTypeOf(config)){
                content = [config]
                config = {}
            }
        }else if(basicTypes.includes(getType(config))){
            content = [config]
            config = {}
        }else if(getType(config)==='array'){
            content = config
            config = {}
        }
        else if(getType(config) === 'function'){
            content = catchChildren(config)
            config = {}
        }else{
            throw TypeError('param1 type error')
        }
    }else{
        if(getType(content) !== 'function') throw 'param 2 need function'
        if(getType(config) !== 'object') throw 'parma 1 need object'
        if(hasTypeOf(config)) throw 'param1 cannot reactElement'
        content = catchChildren(content)
    }
    config = config||{}
    config.children = content
    return {
        config,
    }
}

export  {
    parseParams
}