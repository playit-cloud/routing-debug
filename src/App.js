import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const ENDPOINTS = [
  'http://ping.ply.gg:80',
  'http://147.185.221.1:80',
  'http://209.25.140.1:80',
  'http://209.25.141.1:80',
  'http://209.25.142.1:80',
  'http://209.25.143.1:80',
  'http://23.133.216.1:80',
  'http://[2602:fbaf:804::1]:80',
  'http://[2602:fbaf:808::1]:80',
  'http://[2602:fbaf:80c::1]:80',
  'http://[2602:fbaf:810::1]:80',
  'http://[2602:fbaf:814::1]:80',
  'http://[2602:fbaf:818::1]:80',
  'http://[2602:fbaf:81c::1]:80',
  'http://[2602:fbaf:820::1]:80',
  'http://[2602:fbaf:824::1]:80',
  'http://[2602:fbaf:828::1]:80',
  'http://[2602:fbaf:82c::1]:80',
  'http://[2602:fbaf:830::1]:80',
  'http://[2602:fbaf:834::1]:80',
  'http://[2602:fbaf:838::1]:80',
  'http://[2602:fbaf:83c::1]:80',
  'http://[2602:fbaf:840::1]:80',
  'http://[2602:fbaf:844::1]:80',
  'http://[2602:fbaf:848::1]:80',
  'http://[2602:fbaf:84c::1]:80',
  'http://[2602:fbaf:850::1]:80',
];

const parse = (data) => {
  const lines = data.split('\n');
  const res = {};

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i].trim();
    if (line.length === 0) {
      continue;
    }

    const [key, value] = line.trim().split(': ');
    res[key] = value;
  }

  return res;
};

const parsePing = (pingStr) => {
  const ping = +pingStr.substr(0, pingStr.length - 2);

  return ping;
};

function App() {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState({ pings: {} });

  useEffect(() => {
    (async () => {
      const results = {};

      for (let i = 0; i < ENDPOINTS.length; ++i) {
        const endpoint = ENDPOINTS[i];

        let minPing = 99999999;
        let minRecord = null;

        for (let j = 0; j < 3; ++j) {
          setStatus(`testing ping ${i * 3 + j + 1} of ${ENDPOINTS.length * 3}`);

          try {
            const res = await fetch(endpoint);
            const data = parse(await res.text());

            const ping = parsePing(data['ping']);

            if (!minRecord || ping < minPing) {
              minRecord = data;
              minPing = ping;
            }
          } catch (e) {
            console.error(e);
          }
        }

        setData(data => ({ ...data, pings: { ...data.pings, [endpoint]: minRecord }}));
      }

      setStatus('done');
    })();
  }, []);
  
  return (
    <div>
      <h1>Playit.gg Routing Debug Page</h1>
      <h2>Current Status: {status}</h2>
      <h3>Collected Data</h3>
      <pre style={{userSelect: 'all'}}>
        { JSON.stringify(data, null, 2) }
      </pre>
    </div>
  );
}

export default App;
