import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);
const hostname = "db.xlsszovjljsxtzmnjeeh.supabase.co";

async function check() {
    try {
        console.log(`Resolving ${hostname}...`);
        const addresses = await resolve4(hostname);
        console.log("IPv4 addresses:", addresses);
    } catch (err) {
        console.error("Resolution failed:", err);
    }
}

check();
