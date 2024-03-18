import net from 'net';

const Socket = net.Socket;

/**
 * Tiny app to seek available ports
 * 
 * Starts at 40_000 ends at 60_999
 * This range is the most ideal in my opinion according to what most systems like
 * https://en.wikipedia.org/wiki/Ephemeral_port
 */
export default class PortSeeker {
    min = 40_000;
    max = 60_999;
    
    /**
     * Get the first working port
     */
    async firstOpen(): Promise<number> {
        let port = this.min;
        
        port = await this.firstOpenPort(port);
        
        return port;
    }
    
    /**
     * Check available ports
     * 
     * @param port 
     * @returns 
     */
    async firstOpenPort(port: number): Promise<number> {
        
        return new Promise((resolve, reject) => {
            // Check that it doesn't exceeds the limit
            if(port > this.max) {
                // Don't look anymore
                return reject("All ports in range are being used!");
            }
            
            const socket = new Socket();
            
            const timeout = () => {
                resolve(port);
                socket.destroy();
            };
            
            const next = () => {
                socket.destroy();
                resolve(this.firstOpenPort(++port));
            };
            
            setTimeout(timeout, 10);
            socket.on("timeout", timeout);
            
            // On error try the next port
            socket.on("error", (err: NodeJS.ErrnoException) => {
                // Port in use error
                const portInUse = err.code === 'EADDRINUSE';
                
                if (portInUse) {
                    reject(err);
                } else {
                    resolve(port);
                }
            });
            
            // When it connects we know the port is open
            socket.on("connect", () => next());
            
            socket.connect(port, "0.0.0.0");
        });
    }
    
    /**
     * Test is available but static
     */
    static async firstOpenPort(port: number): Promise<number> {
        const portSeeker = new PortSeeker();
        return await portSeeker.firstOpenPort(port);
    }
}
