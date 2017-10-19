import { mountVNode, flushMount } from './lifecycle'
import { isString, isNumber } from './util'
import { isWidget, isVNode } from './vdom/vnode/types'
import { IVNode, VirtualNode } from './types'

function isVChild (vnode): vnode is string | number | IVNode {
  return isVNode(vnode) || isString(vnode) || isNumber(vnode)
}

export function render (vnode: VirtualNode, container: Element, callback?: Function) {
  if (!isVChild(vnode) && !isWidget(vnode)) {
    return null
  }
  /* istanbul ignore if */
  if (!container || container.nodeType !== 1) {
    throw new Error(`${container} should be a DOM Element`)
  }
  const dom = mountVNode(vnode, {})
  if (dom) {
    container.appendChild(dom)
  }
  if (container) {
    (container as any)._component = vnode
  }
  flushMount()

  if (callback) {
    callback()
  }

  return (vnode as any).component || dom
}
