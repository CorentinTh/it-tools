/**
 * Represents a single item in a file system
 * (i.e. a file or a folder)
 */
export interface FileStructure {
  /** The name of the file or folder */
  name: string

  /** If a folder, the contents of the folder */
  children: FileStructure[]

  /**
   * The number of spaces in front of the name
   * in the original source string
   */
  indentCount: number

  /** The parent directory of this file or folder */
  parent: FileStructure | null
}
