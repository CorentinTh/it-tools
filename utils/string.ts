import {random} from './random'

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const shuffle = (s: string) => s.split('').sort(() => 0.5 - random()).join('')

export {capitalise, shuffle}
