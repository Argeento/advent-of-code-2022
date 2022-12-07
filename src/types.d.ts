interface Array2d<T> extends Array<T[]> {}
interface Array3d<T> extends Array<T[][]> {}

interface Position2d {
  x: number
  y: number
}

interface Position3d extends Position2d {
  z: number
}

interface Point2d extends Position2d {}
interface Point3d extends Position3d {}
