import { Vector, VectorInterface } from './vector'

type Position = {
  x: number
  y: number
}

interface PointInterface {
  // x轴的坐标
  x: number
  // y轴的坐标
  y: number
  // 点距离原点（0，0）的距离
  length: number
  // 和x正轴所成的角度
  angle: number
  // 和x正轴所成的弧度
  angleInRadians: number
  // 点位所在象限
  quadrant: number
  // 是否选中
  selected: boolean
  // 是否相同
  equals(a: Position): boolean
  // 复制对象
  clone(): Point
  // 输出成String
  toString(): string
  // 返回两点间的距离
  getDistance(p: Position): number
  // 以center为圆心顺时针选装角度，改变源对象
  rotate(angle: number, center: Position): void
  // TODO 矩阵变换（暂时没实现）
  transform(): void
  // 判断点是否在矩形中
  isInside(rect: {
    x: number
    y: number
    width: number
    height: number
  }): boolean
  // 是否在指定原的半径之内
  isClose(point: Position, tolerance: number): boolean
  // 检查是否与point共线（平行）
  isCollinear(point: Position): boolean
  // 检查是否与向量point正交（垂直）
  isOrthogonal(point: Position): boolean
  // 检测点是否为原点
  isZero(): boolean
  // 检查是否在指定象限内
  isInQuadrant(quadrant: 1 | 2 | 3 | 4): boolean
  // 返回点积
  dot(p: Position): number
  // 返回叉积
  cross(p: Position): number
  // 点到另一个点的投影
  project(p: Position): Point
  // 四舍五入
  round(): Point
  // 向上舍入
  ceil(): Point
  // 向下舍入
  floor(): Point
  // 绝对值
  abs(): Point
  // 设置值
  set(obj: { x: number; y: number; angle: number }): void
}
/**
 * static
 * min
 * max
 * random
 * equals
 * getLength
 * getAngleProp
 *
 */

export class Point extends Vector implements PointInterface, VectorInterface {
  #x: number
  #y: number
  #length: number
  #angle: number
  #angleInRadians: number
  #quadrant: number
  #selected = false

  constructor(point: Position)
  constructor(object: { x: number; y: number })
  constructor(array: Array<number>)
  constructor(x: number, y: number)
  constructor(
    x: number | Position | Array<number> | { x: number; y: number },
    y = 0,
  ) {
    super()
    let _x: number, _y: number
    if (typeof x === 'number') {
      _x = x
      _y = y
    } else if (Array.isArray(x)) {
      if (x.length > 1) {
        _x = x[0]
        _y = x[1]
      } else if (x.length > 0) {
        _x = x[0]
        _y = 0
      } else {
        _x = 0
        _y = 0
      }
    } else {
      _x = x.x
      _y = x.y
    }
    this.#x = _x
    this.#y = _y
    this.#length = Point.getLength(this)
    const angleProps = Point.getAngleProp(this.#x, this.#y)

    this.#angle = angleProps.angle
    this.#angleInRadians = angleProps.angleInRadians
    this.#quadrant = angleProps.quadrant
  }
  // 是否相同
  equals(a: Position) {
    return Point.equals(this, a)
  }
  // 复制对象
  clone() {
    return new Point(this.#x, this.#y)
  }
  // 输出成String
  toString() {
    return JSON.stringify({
      x: this.#x,
      y: this.#y,
    })
  }
  // 返回两点间的距离
  getDistance(p: Position) {
    return Math.sqrt(Math.pow(this.#x - p.x, 2) + Math.pow(this.#y - p.y, 2))
  }
  // 以center为圆心顺时针选装角度，改变源对象
  rotate(angle: number, center: Position) {
    angle = this.checkAngle(angle)
    const _angle = this.#angle - angle
    const _cx = center.x,
      _cy = center.y
    const obj = this.getAnglePropByAngle(_angle)

    this.#x = _cx + obj.xScale * this.#length
    this.#y = _cy + obj.yScale * this.#length
    this.#angle = obj.angle
    this.#angleInRadians = obj.angleInRadians
    this.#quadrant = obj.quadrant
  }
  // TODO
  transform() {
    console.log('transform')
  }
  // 判断点是否在矩形中
  isInside(rect: { x: number; y: number; width: number; height: number }) {
    if (this.#x >= rect.x && this.#x <= rect.x + rect.width) {
      if (this.#y >= rect.y && this.#y <= rect.height) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  // 是否在指定原的半径之内
  isClose(point: Position, tolerance: number) {
    const length = Point.getLength(this, point)
    if (length <= tolerance) {
      return true
    } else {
      return false
    }
  }
  // 检查是否与point共线（平行）
  isCollinear(point: Position) {
    return this.#y / this.#x === point.y / point.x
  }
  // 检查是否与向量point正交（垂直）
  isOrthogonal(point: Position) {
    return ((this.#y / this.#x) * point.y) / point.x === -1
  }
  // 检测点是否为原点
  isZero() {
    return this.#x === 0 && this.#y === 0
  }
  // 检查是否在指定象限内
  isInQuadrant(quadrant: 1 | 2 | 3 | 4) {
    const _a = this.#angle
    switch (_a) {
      case 360:
      case 0:
        return quadrant === 1 || quadrant === 4
      case 90:
        return quadrant === 1 || quadrant === 2
      case 180:
        return quadrant === 3 || quadrant === 2
      case 270:
        return quadrant === 3 || quadrant === 4
    }
    return this.#quadrant === quadrant
  }
  // 返回点积
  dot(p: Position) {
    return this.#x * p.x + this.#y * p.y
  }
  // 返回叉积
  cross(p: Position) {
    return this.#x * p.y - this.#y * p.x
  }
  // 点到另一个点的投影
  project(p: Position) {
    const A = p.y / p.x
    const B = p.y - A * p.x

    const m = this.#x + A * this.#y

    /// 求两直线交点坐标
    const _x = (m - A * B) / (A * A + 1)
    console.log(new Point(_x, A * _x + B))

    return new Point(_x, A * _x + B)
  }
  // 四舍五入
  round() {
    return new Point(Math.round(this.#x), Math.round(this.#y))
  }
  // 向上舍入
  ceil() {
    return new Point(Math.ceil(this.#x), Math.ceil(this.#y))
  }
  // 向上舍入
  floor() {
    return new Point(Math.floor(this.#x), Math.floor(this.#y))
  }
  // 坐标取绝对值
  abs() {
    return new Point(Math.abs(this.#x), Math.abs(this.#y))
  }
  // 修改属性
  set(obj: { x?: number; y?: number; angle?: number }) {
    if (obj.angle !== undefined) {
      const _obj = this.getAnglePropByAngle(obj.angle)
      this.#angle = _obj.angle
      this.#angleInRadians = _obj.angleInRadians
      this.#quadrant = _obj.quadrant
      this.#x = this.#length * _obj.xScale
      this.#y = this.#length * _obj.yScale
    }
    if (obj.x !== undefined) {
      this.#x = obj.x
      this.#length = Point.getLength(this)
    }
    if (obj.y !== undefined) {
      this.#y = obj.y
      this.#length = Point.getLength(this)
    }
  }

  add(prop: number): Point
  add(prop: Position): Point
  add(prop: Position | number) {
    return Vector.add(this, prop as AnyType)
  }
  subtract(prop: number): Point
  subtract(prop: Position): Point
  subtract(prop: Position | number) {
    return Vector.subtract(this, prop as AnyType)
  }
  multiply(prop: number): Point
  multiply(prop: Position): Point
  multiply(prop: Position | number) {
    return Vector.multiply(this, prop as AnyType)
  }
  divide(prop: number): Point
  divide(prop: Position): Point
  divide(prop: Position | number) {
    return Vector.divide(this, prop as AnyType)
  }
  modulo(prop: number): Point
  modulo(prop: Position): Point
  modulo(prop: Position | number) {
    return Vector.modulo(this, prop as AnyType)
  }

  // 取点位数组个位置的最小值
  static min(points: Array<Position>) {
    let minX = Number.MAX_VALUE,
      minY = Number.MAX_VALUE
    points.map(p => {
      minX = Math.min(minX, p.x)
      minY = Math.min(minY, p.y)
    })
    return new Point(minX, minY)
  }
  // 取点位数组个位置的最小值
  static max(points: Array<Position>) {
    let maxX = Number.MIN_VALUE,
      maxY = Number.MIN_VALUE
    points.map(p => {
      maxX = Math.max(maxX, p.x)
      maxY = Math.max(maxY, p.y)
    })
    return new Point(maxX, maxY)
  }
  // 随机
  static random() {
    return new Point(Math.random(), Math.random())
  }
  static equals(a: Position, b: Position) {
    return a.x === b.x && a.y === b.y
  }
  // 2点的距离
  static getLength(p1: Position, p2 = { x: 0, y: 0 }): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }
  // 获取点位角度的各项参数
  static getAngleProp(
    x: number,
    y: number,
  ): {
    angle: number
    angleInRadians: number
    quadrant: number
  } {
    let angle = 0
    if (x === 0 && y === 0) {
      return {
        angle,
        angleInRadians: 0,
        quadrant: 1,
      }
    } else {
      const slope = y / x

      const angleInRadians = Math.abs(Math.atan(slope))
      let quadrant = 4
      if (x >= 0 && y >= 0) {
        quadrant = 1
      } else if (x < 0 && y >= 0) {
        quadrant = 2
      } else if (x <= 0 && y < 0) {
        quadrant = 3
      }

      if (angleInRadians == 0) {
        if (x >= 0) {
          angle = 0
        } else {
          angle = 180
        }
      } else {
        angle = (180 * angleInRadians) / Math.PI + (quadrant - 1) * 90
      }

      return {
        angle,
        angleInRadians,
        quadrant,
      }
    }
  }
  // 检查角度是否大于360 或者小于0，归正
  private checkAngle(val: number) {
    if (val > 0) {
      while (val > 360) {
        val -= 360
      }
    } else {
      while (val < 0) {
        val += 360
      }
    }
    return val
  }

  private getAnglePropByAngle(val: number) {
    val = this.checkAngle(val)
    const _angle = val
    const _angleInRadians = (this.#angle * Math.PI) / 180
    let _quadrant: number, xScale: number, yScale: number
    // const x = Math.cos(this.#angleInRadians)
    if (_angle > 270) {
      _quadrant = 4
      const ar = ((360 - _angle) * Math.PI) / 180
      xScale = Math.cos(ar)
      yScale = -Math.sin(ar)
    } else if (_angle > 180) {
      _quadrant = 3
      const ar = ((_angle - 180) * Math.PI) / 180
      xScale = -Math.cos(ar)
      yScale = -Math.sin(ar)
    } else if (_angle > 90) {
      _quadrant = 2
      const ar = ((180 - _angle) * Math.PI) / 180
      xScale = -Math.cos(ar)
      yScale = Math.sin(ar)
    } else {
      _quadrant = 1
      const ar = (_angle * Math.PI) / 180
      xScale = Math.cos(ar)
      yScale = Math.sin(ar)
    }
    return {
      angle: _angle,
      angleInRadians: _angleInRadians,
      quadrant: _quadrant,
      xScale,
      yScale,
    }
  }

  get angle(): number {
    return this.#angle
  }

  set angle(val: number) {
    this.set({ angle: val })
  }

  get x(): number {
    return this.#x
  }
  set x(x: number) {
    this.set({ x })
  }
  get y(): number {
    return this.#y
  }
  set y(y: number) {
    this.set({ y })
  }
  get length(): number {
    return this.#length
  }
  get angleInRadians(): number {
    return this.#angleInRadians
  }
  get quadrant(): number {
    return this.#quadrant
  }
  get selected(): boolean {
    return this.#selected
  }
}
