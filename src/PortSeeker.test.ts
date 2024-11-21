import PortSeeker from "./PortSeeker";

describe("PortSeeker", () => {
	let portSeeker: PortSeeker;

	beforeEach(() => {
		portSeeker = new PortSeeker();
	});

	it("should gather the specified number of open ports", async () => {
		const count = 5; // Number of ports to gather
		const ports = await portSeeker.gatherPorts(count);
		expect(ports).toHaveLength(count);
		expect(new Set(ports).size).toBe(count); // Ensure ports are unique
	});
    
	it("should find an available port within range", async () => {
		const newPortSeeker = new PortSeeker();
		const availablePort = await newPortSeeker.firstOpen();

		expect(availablePort).toBeGreaterThanOrEqual(40000);
	});
});
