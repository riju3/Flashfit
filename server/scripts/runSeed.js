import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import connectDB from '../config/connectDB.js';
import { seedProductsController } from '../controllers/product.controller.js';

async function main() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await connectDB();
        
        console.log('Starting full 100-product seed operation (wipe DB & re-seed)...');
        
        const mockResponse = {
            json: (data) => {
                console.log('\n================ SEED RESULT ================');
                console.log(JSON.stringify(data, null, 2));
                return data;
            },
            status: (code) => {
                console.log('Response Status:', code);
                return mockResponse;
            }
        };

        await seedProductsController({}, mockResponse);
        console.log('\nSeed process completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Fatal seed error:', err);
        process.exit(1);
    }
}

main();
