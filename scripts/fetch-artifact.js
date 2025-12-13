const https = require('https');
const fs = require('fs');
const path = require('path');

function getToken(){
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.PERSONAL_ACCESS_TOKEN || process.env.GITHUB_PAT;
}

function apiGet(url, token){
  const opts = new URL(url);
  const headers = {
    'User-Agent': 'fetch-artifact-script',
    'Accept': 'application/vnd.github+json'
  };
  if(token) headers['Authorization'] = `token ${token}`;
  return new Promise((resolve, reject)=>{
    const req = https.get({...opts, headers}, res =>{
      let body = '';
      res.on('data', d=> body+=d);
      res.on('end', ()=>{
        if(res.statusCode >=400) return reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        try{ resolve(JSON.parse(body)); }catch(e){ resolve(body); }
      });
    });
    req.on('error', reject);
  });
}

function download(url, dest, token){
  return new Promise((resolve, reject)=>{
    const opts = new URL(url);
    const headers = { 'User-Agent': 'fetch-artifact-script' };
    if(token) headers['Authorization'] = `token ${token}`;
    const req = https.get({...opts, headers}, res =>{
      if(res.statusCode >=300 && res.statusCode <400 && res.headers.location){
        // follow redirect
        return download(res.headers.location, dest, token).then(resolve).catch(reject);
      }
      if(res.statusCode >=400) return reject(new Error(`Download HTTP ${res.statusCode}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', ()=> file.close(()=> resolve(dest)));
      file.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function main(){
  const [owner, repo, runId, artifactName] = process.argv.slice(2);
  if(!owner || !repo || !runId){
    console.error('Usage: node fetch-artifact.js <owner> <repo> <runId> [artifactName]');
    process.exit(2);
  }
  const token = getToken();
  if(!token){
    console.error('No GitHub token found in env. Set GITHUB_TOKEN or GH_TOKEN.');
    process.exit(3);
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`;
  console.log('Querying artifacts for run', runId);
  const data = await apiGet(apiUrl, token);
  if(!data || !data.artifacts || data.artifacts.length===0){
    console.error('No artifacts found for run');
    process.exit(4);
  }
  let artifact = null;
  if(artifactName){
    artifact = data.artifacts.find(a=>a.name === artifactName);
  }
  if(!artifact) artifact = data.artifacts[0];
  console.log('Found artifact:', artifact.name, 'id=', artifact.id);

  const downloadUrl = artifact.archive_download_url;
  const outDir = path.join(__dirname, '..', 'artifacts');
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
  const zipPath = path.join(outDir, `${artifact.name}.zip`);
  console.log('Downloading to', zipPath);
  await download(downloadUrl, zipPath, token);
  console.log('Download complete. Extracting...');

  // extract using PowerShell Expand-Archive if available, else just report location
  const isWin = process.platform === 'win32';
  if(isWin){
    const {execSync} = require('child_process');
    const dest = path.join(outDir, artifact.name);
    try{
      if(fs.existsSync(dest)) fs.rmSync(dest, {recursive:true, force:true});
      execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${dest}' -Force"`, {stdio:'inherit'});
      console.log('Extracted to', dest);
      const reportFile = path.join(dest, 'pa11y-report.json');
      if(fs.existsSync(reportFile)){
        console.log('Report found at', reportFile);
        console.log(fs.readFileSync(reportFile,'utf8'));
      } else {
        console.log('No pa11y-report.json found inside artifact. Listing files:');
        console.log(fs.readdirSync(dest));
      }
    }catch(e){
      console.error('Extraction failed:', e.message);
      console.log('Zip located at', zipPath);
      process.exit(5);
    }
  } else {
    console.log('Non-Windows platform — artifact zip saved at', zipPath);
  }
}

main().catch(e=>{
  console.error('Error:', e && e.message ? e.message : e);
  process.exit(10);
});
