declare module "email-bounce-parser-browser" {
    export default class EmailBounceParse {
        read(emailContent: string): {
            bounce: boolean
            recipient?: string
            data: any
            command: string
            server?: {
                hostname: string
                ip: string
                port: string
            }
            email?: {
                error?: string
            }
        }
    } 
}