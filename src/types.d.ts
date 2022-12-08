interface Array2d<T> extends Array<T[]> {}
interface Array3d<T> extends Array<T[][]> {}

interface Position {
  x: number
  y: number
}

interface Position3d extends Position {
  z: number
}

interface Point extends Position {}
interface Point3d extends Position3d {}
