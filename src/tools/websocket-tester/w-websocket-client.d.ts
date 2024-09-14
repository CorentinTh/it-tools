declare module "w-websocket-client/dist/w-websocket-client.umd.js" {
    export default class WSC {
        constructor(options: {
            url: string
            token: string
            open?: () => void
            close?: () => void
            message?: (data: any) => void
            error?: (err: any) => void
          });
        
        send(data: any): void
    }
}