import { TestClient } from './index';
import dotenv from 'dotenv';
dotenv.config();


if (process.env.BOT_TOKEN) {
    console.log("BOT_TOKEN is present in bun test");
} else {
    console.log("BOT_TOKEN is NOT present in bun test");
}

if (process.env.CLIENT_ID) {
    console.log("CLIENT_ID is present in bun test");
} else {
    console.log("CLIENT_ID is NOT present in bun test");
}

describe('TestClient', () => {
    it('should log "[Test Client] listening for messages..." when connected', async () => {

        const testClient = new TestClient();

        const consoleSpy = jest.spyOn(console, 'log');

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

        expect(consoleSpy).toHaveBeenCalledWith('[Test Client] listening for messages...');

        consoleSpy.mockRestore();
    });
});