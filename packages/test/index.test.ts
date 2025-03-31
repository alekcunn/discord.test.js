import { TestClient } from './index';
import dotenv from 'dotenv';
dotenv.config();


describe('TestClient', () => {
    it('should log "[Test Client] listening for messages..." when connected', async () => {

        const testClient = new TestClient();

        const consoleSpy = jest.spyOn(console, 'log');

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

        expect(consoleSpy).toHaveBeenCalledWith('[Test Client] listening for messages...');

        consoleSpy.mockRestore();
    });
});