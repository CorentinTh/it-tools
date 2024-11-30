declare module "email-bounce-parser-browser" {
    export default class EmailBounceParse {
        read(emailContent: string): {
            bounce: boolean
            email?: {
                body?: string
                intro?: string
                error?: string
            }
            data?: {
                error?: {
                code?: {
                    basic?: string
                    enhanced?:string
                }
                label?: string
                type?: string
                temporary?: boolean
                permanent?: boolean
                data?: {
                    type?: string
                    blocked?: boolean
                    spam?: boolean
                }
                }
                recipient?:string
                server?: {
                hostname?: string
                ip?: string
                port?: string
                }
                command?: string
            }
        }
    } 
}