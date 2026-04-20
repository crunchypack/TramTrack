
interface VTToken {
  accessToken: string;
  expiresAt: number;
}

// Stays in memory on the server across API calls
let cachedToken: VTToken | null = null;

export async function getVasttrafikToken(): Promise<string> {
  const now = Date.now();

  // 1. Return cached token if it's still valid (with a 1-minute buffer)
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.accessToken;
  }

  console.log("Fetching fresh Västtrafik token...");

  const clientId = process.env.VASTTRAFIK_CLIENT_ID;
  const clientSecret = process.env.VASTTRAFIK_CLIENT_SECRET;
  
  // Västtrafik requires "Basic" auth using Base64(id:secret)
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://ext-api.vasttrafik.se/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch VT Token: ${response.statusText}`);
  }

  const data = await response.json();

  // 2. Cache the token
  cachedToken = {
    accessToken: data.access_token,
    // data.expires_in is usually 86400 seconds (24h)
    expiresAt: now + (data.expires_in * 1000),
  };

  return cachedToken.accessToken;
}

export async function findGidForStop(stopName: string,existingToken?:string) {
  const token = existingToken || await getVasttrafikToken();
  const response = await fetch(
    `https://ext-api.vasttrafik.se/pr/v4/locations/by-text?q=${encodeURIComponent(stopName)}&limit=1`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const data = await response.json();
  return data.results?.[0]?.gid;
}