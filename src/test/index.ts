import { testFindOpenPort } from "../PortSeeker.test";

/**
 * Run all tests
 */
export default async function runAllTests() {
    await testFindOpenPort();
}
