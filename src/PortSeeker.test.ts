import PortSeeker from "./PortSeeker";
import { testMessage } from "./test/testMessage";

/**
 * Find an open port
 */
export async function testFindOpenPort() {
    const seeker = new PortSeeker();
    const port = await seeker.firstOpen();
    
    // For assert we will use the same function again
    testMessage(PortSeeker.firstOpenPort(port), `Port ${port} is available`);
}
