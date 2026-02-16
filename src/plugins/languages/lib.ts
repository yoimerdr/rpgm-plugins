/**
 * Base interface for objects that can be serialized to JSON.
 * Objects implementing this interface can control their JSON representation
 * by providing a custom toJSON() method.
 */
export interface JsonSerializable {
  /**
   * Called when the object is serialized to JSON via JSON.stringify().
   * @returns The JSON-serializable representation of this object
   */
  toJSON?(): any
}

/**
 * Base interface for objects that have a name property.
 */
export interface Nameable {
  /** The name of the object */
  name: string
}
