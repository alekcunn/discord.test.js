import WebSocket from 'ws';
import axios from 'axios';

export class TestClient {
    clientId: string | undefined;
    token: string | undefined;
    ws: WebSocket | undefined;
    url: Promise<URL>;
    constructor(clientId?: string, token?: string) {
        
        this.clientId = clientId ?? process.env.CLIENT_ID;
        this.token = token ?? process.env.BOT_TOKEN;

        if (!this.clientId) {
            throw new Error('Client ID is required');
        }
        if (!this.token) {
            throw new Error('Token is required');
        }

        this.url = (async () => {
            try {
                let response = await axios.get('https://discord.com/api/v10/gateway/bot', {
                    headers: {
                        Authorization: `Bot ${this.token}`,
                        'User-Agent': 'API',
                    },
                }).catch((error) => {
                    console.error('[Test Client] Error fetching gateway URL:', error);
                    throw new Error('Error fetching gateway URL');
                });
                return new URL(response.data.url + `?v=10&encoding=json`);
            } catch (error) {
                console.error('[Test Client] Failed to fetch gateway URL:', error);
                throw new Error('Failed to fetch gateway URL');
            }
        })();

        this.url.then((resolvedUrl) => {
            this.ws = new WebSocket(resolvedUrl);
            this.connect().then(() => {
                console.log('[Test Client] WebSocket connected');
            })
        }).catch((error) => {
            console.error('[Test Client] Failed to initialize WebSocket:', error);
            throw new Error('Failed to initialize WebSocket');
        });

        


    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {

            if (!this.ws) {
                console.error('[Test Client] Failed to create WebSocket instance');
                return reject(new Error('Failed to create WebSocket instance'));
            }

            this.ws.on('open', () => {
                console.log('[Test Client] listening for messages...');
                resolve();
            });

            this.ws.on('error', (error) => {
                console.error('[Test Client] Error with gateway:  ', error);
                reject(error);
            });

            this.ws.on('message', (data) => {
                const message = JSON.parse(data.toString());
                console.log('[Test Client] Received message:', message);
                if (message.op === 10) {
                    if (this.ws) {
                        this.ws.send(JSON.stringify({
                            op: 1,
                            d: message.d.heartbeat_interval,
                        }));
                    } else {
                        console.error('[Test Client] WebSocket is undefined, cannot send message.');
                    }
                }
            });
        });
    }
}