import net from "net";

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
	private reservedPorts = new Set<number>(); // Tracks already allocated ports

	/**
	 * Get a specified number of open ports.
	 *
	 * @param count - Number of ports to gather
	 */
	public async gatherPorts(count: number): Promise<number[]> {
		const ports: number[] = [];
		let currentPort = this.min;

		while (ports.length < count) {
			try {
				const port = await this.firstOpenPort(currentPort);
				ports.push(port);
				this.reservedPorts.add(port); // Mark the port as reserved
				currentPort = port + 1; // Move to the next port after finding one
			} catch (error) {
				throw new Error(
					`Unable to find enough open ports. Found ${ports.length} of ${count}.`
				);
			}
		}

		return ports;
	}

	/**
	 * Get the first working port starting from the minimum range.
	 */
	public async firstOpen(): Promise<number> {
		return this.firstOpenPort(this.min);
	}

	/**
	 * Check available ports starting from a specific port.
	 *
	 * @param port - Starting port for the search
	 * @returns The first open port
	 */
	private async firstOpenPort(port: number): Promise<number> {
		return new Promise((resolve, reject) => {
			// Check that the port is within range
			if (port > this.max) {
				return reject("All ports in range are being used!");
			}

			// Skip already reserved ports
			if (this.reservedPorts.has(port)) {
				return resolve(this.firstOpenPort(port + 1));
			}

			const socket = new net.Socket();

			const cleanup = () => {
				socket.removeAllListeners();
				socket.destroy();
			};

			const next = () => {
				cleanup();
				resolve(this.firstOpenPort(port + 1));
			};

			// On successful connection, try the next port
			socket.on("connect", next);

			// If port is available, resolve with the port number
			socket.on("timeout", () => {
				cleanup();
				resolve(port);
			});

			// On error, determine if we should try the next port
			socket.on("error", (err: any) => {
				cleanup();
				if (err.code === "EADDRINUSE") {
					resolve(this.firstOpenPort(port + 1));
				} else {
					resolve(port);
				}
			});

			// Timeout after 10ms
			socket.setTimeout(10);
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
