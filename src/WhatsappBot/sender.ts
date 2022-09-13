import {create, Whatsapp, Message, SocketState} from 'venom-bot'

class Sender{
    private client: Whatsapp

    constructor(){
        this.initialize()
    }

    async sendText(to: string, body: string){
        
        this.client.sendText(to, body)
    }

    private initialize(){
        const qr = (base64Qrimg: string) => {
            console.log()
        }

        const status = (statusSession: string) => {

        }

        const start = (client: Whatsapp) => {
            this.client = client
            
            this.sendText("5512996698331@c.us", 'Ola, tudo bem ? Este é um teste')
        }

        create('msi-sender-dev', qr, status).then((client) => start(client)).catch((error) => console.log(error))
    }
}

export default Sender