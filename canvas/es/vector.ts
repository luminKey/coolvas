import { Point } from './point'

type Position = {
  x: number
  y: number
}

export interface VectorInterface {
  add(prop: number): Point
  add(prop: Position): Point
  subtract(prop: number): Point
  subtract(prop: Position): Point
  multiply(prop: number): Point
  multiply(prop: Position): Point
  divide(prop: number): Point
  divide(prop: Position): Point
  modulo(prop: number): Point
  modulo(prop: Position): Point
}

export class Vector {
  // 向量相加
  static add(p: Position, prop: number): Point
  static add(p: Position, prop: Position): Point
  static add(p: Position, prop: Position | number) {
    let x = p.x,
      y = p.y
    if (typeof prop === 'number') {
      x += prop
      y += prop
    } else {
      x += prop.x
      y += prop.y
    }
    return new Point(x, y)
  }

  // 向量相减
  static subtract(p: Position, prop: number): Point
  static subtract(p: Position, prop: Position): Point
  static subtract(p: Position, prop: Position | number) {
    let x = p.x,
      y = p.y
    if (typeof prop === 'number') {
      x -= prop
      y -= prop
    } else {
      x -= prop.x
      y -= prop.y
    }
    return new Point(x, y)
  }

  // 向量相乘
  static multiply(p: Position, prop: number): Point
  static multiply(p: Position, prop: Position): Point
  static multiply(p: Position, prop: Position | number) {
    let x = p.x,
      y = p.y
    if (typeof prop === 'number') {
      x *= prop
      y *= prop
    } else {
      x *= prop.x
      y *= prop.y
    }
    return new Point(x, y)
  }
  // 向量相除
  static divide(p: Position, prop: number): Point
  static divide(p: Position, prop: Position): Point
  static divide(p: Position, prop: Position | number) {
    let x = p.x,
      y = p.y
    if (typeof prop === 'number') {
      if (prop === 0) {
        x = 0
        y = 0
      } else {
        x /= prop
        y /= prop
      }
    } else {
      x = prop.x === 0 ? 0 : x / prop.x
      y = prop.y === 0 ? 0 : y / prop.y
    }
    return new Point(x, y)
  }

  // 向量取余
  static modulo(p: Position, prop: number): Point
  static modulo(p: Position, prop: Position): Point
  static modulo(p: Position, prop: Position | number) {
    let x = p.x,
      y = p.y
    if (typeof prop === 'number') {
      if (prop === 0) {
        x = 0
        y = 0
      } else {
        x %= prop
        y %= prop
      }
    } else {
      x = prop.x === 0 ? 0 : x % prop.x
      y = prop.y === 0 ? 0 : y % prop.y
    }
    return new Point(x, y)
  }
}
