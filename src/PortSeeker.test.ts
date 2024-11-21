import PortSeeker from "./PortSeeker";
import { testMessage } from "./test/testMessage";

/**
 * Find an open port
 * 
 * @deprecated It won't work because you can't import this file directly
 */
export async function testFindOpenPort() {
	const seeker = new PortSeeker();
	const port = await seeker.firstOpen();

	// For assert we will use the same function again
	testMessage(PortSeeker.firstOpenPort(port), `Port ${port} is available`);
}

describe("PortSeeker", () => {
	it("should find an available port within range", async () => {
		const portSeeker = new PortSeeker();
		const availablePort = await portSeeker.firstOpen();

		expect(availablePort).toBeGreaterThanOrEqual(40000);
	});
});
