declare module 'saxen' {
  export type DecodeEntities = (value: string) => string
  export type AttributeGetter = () => Record<string, string>
  export type ContextGetter = () => { line: number; column: number; data: string }

  export class Parser {
    constructor(options?: { proxy?: boolean })
    ns(mapping?: Record<string, string>): this
    on(event: 'openTag', callback: (name: string, attributes: AttributeGetter, decode: DecodeEntities, selfClosing: boolean, context: ContextGetter) => void): this
    on(event: 'closeTag', callback: (name: string, decode: DecodeEntities, selfClosing: boolean, context: ContextGetter) => void): this
    on(event: 'text' | 'comment', callback: (value: string, decode: DecodeEntities, context: ContextGetter) => void): this
    on(event: 'cdata' | 'question', callback: (value: string, context: ContextGetter) => void): this
    on(event: 'attention', callback: (value: string, decode: DecodeEntities, context: ContextGetter) => void): this
    on(event: 'error' | 'warn', callback: (error: Error, context: ContextGetter) => void): this
    parse(xml: string): Error | undefined
    write(chunk: string): this
    end(): Error | undefined
  }

  export function decode(value: string): string
}
