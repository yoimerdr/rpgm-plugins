export interface JsonSerializable {
  toJSON?(): any
}

export interface Nameable {
  name: string
}

