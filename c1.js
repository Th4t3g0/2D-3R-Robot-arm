
//set up 
let l1=100;
let l2=100;
let l3=100;
let q=-1;
let PenUp=true;//
let pos =[200,200];
let tcp=[0,0];
let xx1=0;
let yy1=0;
const T = [
  [1, 0, 0, 60],
  [1, 1, 0, 20],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];
///Transformation matrix


///To Use
function ForwardKinematic(th1,th2,th3) {
    let th_rad1 =th1//*Math.PI/180;
    let th_rad2 =th2//*Math.PI/180;
    let th_rad3=th3//*Math.PI/180;

    let x = l1*Math.cos(th_rad1)+l2*Math.cos(th_rad1+th_rad2)+l3*Math.cos(th_rad1+th_rad2+th_rad3);
    let y =l1*Math.sin(th_rad1)+l2*Math.sin(th_rad1+th_rad2)+l3*Math.sin(th_rad1+th_rad2+th_rad3);
    return [x,y];
}


//To USE
function InverseKinematic(x,y) {
    let alpha=Math.atan2(y,x);// aplha = theta1 + theta2 + theta3
    x2=x-l3*Math.cos(alpha);
    y2=y-l3*Math.sin(alpha);
    let c2 = ((x2*x2)+(y2*y2)-(l1*l1)-(l2*l2))/(2*l1*l2);
    let s2 =Math.sqrt(Math.max(0,1-c2*c2));

    let theta2 = Math.atan2(s2,c2); //Theta 2

    let dev =((l1+l2*c2)**2) +(l2**2)*(s2**2); 


    let s1 =(y2*(l1+l2*c2)-x2*(l2*s2))/(dev) ;
    let c1 = (x2*(l1+l2*c2)+y2*(l2*s2))/(dev)

    let theta1=Math.atan2(s1,c1);
    let theta3 =alpha-theta1-theta2;

    output =[theta1,theta2,theta3];
    
    return output;
}



function Reach(x,y) {
    return Math.sqrt(x*x+y*y);
}


function JointLocation(A) {
    let x1 = l1*Math.cos(A[0]);
    let y1 =l1*Math.sin(A[0]);

    let x2 = l1*Math.cos(A[0])+l2*Math.cos(A[0]+A[1]);
    let y2 =l1*Math.sin(A[0])+l2*Math.sin(A[0]+A[1]);

    let x3=l1*Math.cos(A[0])+l2*Math.cos(A[0]+A[1])+l3*Math.cos(A[0]+A[1]+A[2]);
    let y3=l1*Math.sin(A[0])+l2*Math.sin(A[0]+A[1])+l3*Math.sin(A[0]+A[1]+A[2]);
 

    
    let joint = [x1,y1,x2,y2,x3,y3];
    return joint;
}




function stroke(V) {
    let l = V[0];
    let angle = V[1]; 

    let step = 0.05; // segment length
    let n = Math.ceil(l / step);

    let sx = tcp[0];
    let sy = tcp[1];

    let output=[0,0];

    for (let ii = 1; ii <= n; ii++) {
        let dx = sx + (l * ii / n) * Math.cos(angle);
        let dy = sy + (l * ii / n) * Math.sin(angle);

        // wobble
        dx += (Math.random() - 0.5) * .8; 
        dy += (Math.random() - 0.5) * .8; 


        
        //console.log(dx);

        const newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        newLine.setAttribute("x1", sx);
        newLine.setAttribute("y1", sy);
        newLine.setAttribute("x2", dx);
        newLine.setAttribute("y2", dy);
        newLine.setAttribute("stroke", "black");
        newLine.setAttribute("stroke-width", "2");
        newLine.setAttribute("stroke-linecap", "round");
        newLine.classList.add("strokes");

        
        setTimeout(() => {


            
            if (!PenUp) {
                LL(dx,dy);
                document.getElementById("robotArm").appendChild(newLine);
            }
            
           
        }, ii * 30);

         sx = dx;
         sy = dy;

        if(ii==n){
            LL(dx,dy);
        }
        
        output=[dx,dy];
        tcp=[dx,dy];
        
    }
    console.log(output[0]);
    console.log(output[1]);
    return output;
}







    






  












function DrawLoop(joint) {

    //console.log(joint[4]);
    ///Draw the firlst link from base to joint 1
      document.getElementById('link1').setAttribute('x1', 0);
      document.getElementById('link1').setAttribute('y1', 0);
      document.getElementById('link1').setAttribute('x2', joint[0]);
      document.getElementById('link1').setAttribute('y2', joint[1]);
    
      document.getElementById('j1').setAttribute('cx', joint[0]);
      document.getElementById('j1').setAttribute('cy', joint[1]);

      document.getElementById('link2').setAttribute('x1', joint[0]);
      document.getElementById('link2').setAttribute('y1', joint[1]);
      document.getElementById('link2').setAttribute('x2', joint[2]);
      document.getElementById('link2').setAttribute('y2', joint[3]);

      document.getElementById('j2').setAttribute('cx', joint[2]);
      document.getElementById('j2').setAttribute('cy', joint[3]);
    
      document.getElementById('link3').setAttribute('x1', joint[2]);
      document.getElementById('link3').setAttribute('y1', joint[3]);
      document.getElementById('link3').setAttribute('x2', joint[4]);
      document.getElementById('link3').setAttribute('y2', joint[5]);


    
      document.getElementById('EE').setAttribute('cx', joint[4]);
      document.getElementById('EE').setAttribute('cy', joint[5]);
    
}
///////////////////////




const svg = document.getElementById('robotArm');
const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path.setAttribute('stroke', 'black');
path.setAttribute('fill', 'none');
svg.appendChild(path);

let pathData = '';

function addPointToPath(x, y) {
    if(PenUp){
        
        pathData += `M ${x},${y}`;
        return;
    }
  if (pathData === '') {
    pathData = `M ${x},${y}`; // Start new path
  } else {
    pathData += ` L ${x},${y}`; // Add line segment
  }
  path.setAttribute('d', pathData); // Update path
}










function followMouse() {

    const svg = document.getElementById('robotArm');

   svg.addEventListener('mousemove', function(event) {
  
  const pt = svg.createSVGPoint();
  pt.x = event.clientX+400;
  pt.y = event.clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
  let angles=InverseKinematic(svgP.x.toFixed(2)+200,svgP.y.toFixed(2));
  let joints = JointLocation(angles);
  DrawLoop(joints);

});

}


function followMous() {

    const svg = document.getElementById('robotArm');

   svg.addEventListener('mousemove', function(event) {
  
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
  addPointToPath(svgP.x.toFixed(2),svgP.y.toFixed(2));
 
});
    svg.addEventListener('mousedown', function(event) {PenUp=!PenUp; });

}



function LL(x,y) {
  let angles=InverseKinematic(x+200,y);
  let joints = JointLocation(angles);
  DrawLoop(joints);
}


// ============ IMAGE DRAWING + COLOUR (replaces the previous block at the END of c1.js) ============
// Colour pipeline: image -> k-means palette -> hatch-fill each colour region with scanlines
//                  (pen "changes colour" per palette entry, lightest first) -> black edge outlines on top.

const DRAW_BOX = { x0: -90, y0: -80, w: 160, h: 160 };  // reachable "paper" in SVG coords
const RES = 110;            // resolution used for outlines
const RES_FILL = 64;        // resolution used for colour fill (lower = faster drawing)
let drawJob = null;
let imgEl = null;

const SVGNS = "http://www.w3.org/2000/svg";
const armGroup = svg.querySelector("g");

const paper = document.createElementNS(SVGNS, "rect");
paper.setAttribute("x", DRAW_BOX.x0); paper.setAttribute("y", DRAW_BOX.y0);
paper.setAttribute("width", DRAW_BOX.w); paper.setAttribute("height", DRAW_BOX.h);
paper.setAttribute("fill", "white"); paper.setAttribute("stroke", "#ddd");
paper.setAttribute("stroke-dasharray", "4 3");
svg.insertBefore(paper, armGroup);
const drawLayer = document.createElementNS(SVGNS, "g");
svg.insertBefore(drawLayer, armGroup);

// small helpers so missing controls fall back to defaults
function setStatus(msg) { const s = document.getElementById("status"); if (s) s.textContent = msg; }
function val(id, def) { const e = document.getElementById(id); return e ? +e.value : def; }
function isOn(id, def) { const e = document.getElementById(id); return e ? e.checked : def; }
const lum = c => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];

// ---------- 1. Image processing ----------
function imageToGray(img, res = RES) {          // EDITED: resolution param + returns raw RGBA too
    const s = res / Math.max(img.width, img.height);
    const w = Math.max(3, Math.round(img.width * s));
    const h = Math.max(3, Math.round(img.height * s));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    const g = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    return { g, w, h, d };
}

function blurGray(g, w, h) {
    const o = new Float32Array(g);
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            let s = 0;
            for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) s += g[(y + j) * w + x + i];
            o[y * w + x] = s / 9;
        }
    }
    return o;
}

function detectEdges(g, w, h, thr) {
    const mag = new Float32Array(w * h);
    const dir = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            const i = y * w + x;
            const gx = -g[i - w - 1] + g[i - w + 1] - 2 * g[i - 1] + 2 * g[i + 1] - g[i + w - 1] + g[i + w + 1];
            const gy = -g[i - w - 1] - 2 * g[i - w] - g[i - w + 1] + g[i + w - 1] + 2 * g[i + w] + g[i + w + 1];
            mag[i] = Math.hypot(gx, gy);
            let a = Math.atan2(gy, gx) * 180 / Math.PI;
            if (a < 0) a += 180;
            dir[i] = (a < 22.5 || a >= 157.5) ? 0 : a < 67.5 ? 1 : a < 112.5 ? 2 : 3;
        }
    }
    const edge = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            const i = y * w + x;
            const off = [1, w + 1, w, w - 1][dir[i]];
            if (mag[i] > thr && mag[i] > mag[i - off] && mag[i] >= mag[i + off]) edge[i] = 1;
        }
    }
    return edge;
}

// ---------- 2a. NEW: colour quantisation (k-means, farthest-point start) ----------
function quantize(d, n, K) {
    const px = i => [d[i * 4], d[i * 4 + 1], d[i * 4 + 2]];
    const dist = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
    const C = [px(n >> 1)];
    const md = new Float32Array(n).fill(Infinity);
    while (C.length < K) {                       // spread the starting colours out
        let bi = 0, bv = -1;
        for (let i = 0; i < n; i++) {
            md[i] = Math.min(md[i], dist(px(i), C[C.length - 1]));
            if (md[i] > bv) { bv = md[i]; bi = i; }
        }
        C.push(px(bi));
    }
    const lab = new Uint8Array(n);
    for (let it = 0; it < 6; it++) {
        const sum = C.map(() => [0, 0, 0, 0]);
        for (let i = 0; i < n; i++) {
            const p = px(i);
            let b = 0, bv = Infinity;
            for (let k = 0; k < K; k++) { const v = dist(p, C[k]); if (v < bv) { bv = v; b = k; } }
            lab[i] = b;
            const s = sum[b]; s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; s[3]++;
        }
        sum.forEach((s, k) => { if (s[3]) C[k] = [s[0] / s[3], s[1] / s[3], s[2] / s[3]]; });
    }
    return { lab, C };
}

// ---------- 2b. NEW: colour fill = horizontal scanline runs, one pen colour at a time ----------
function fillStrokes(lab, C, w, h) {
    const out = [];
    const order = C.map((c, k) => k).sort((a, b) => lum(C[b]) - lum(C[a]));   // light -> dark
    for (const k of order) {
        const c = C[k];
        if (lum(c) > 235) continue;              // near-white = the paper, leave blank
        const color = `rgb(${c.map(Math.round)})`;
        for (let y = 0; y < h; y++) {
            const runs = [];
            let x = 0;
            while (x < w) {
                if (lab[y * w + x] !== k) { x++; continue; }
                const x0 = x;
                while (x < w && lab[y * w + x] === k) x++;
                runs.push([x0 - 0.5, x - 0.5]);
            }
            if (y % 2) { runs.reverse(); runs.forEach(r => r.reverse()); }    // zig-zag to save travel
            runs.forEach(r => out.push({ color, pts: [[r[0], y], [r[1], y]] }));
        }
    }
    return out;
}

// ---------- 2c. Outline tracing (unchanged) ----------
function traceStrokes(edge, w, h) {
    const visited = new Uint8Array(w * h);
    let todo = [];
    for (let i = 0; i < w * h; i++) if (edge[i]) todo.push(i);
    const strokes = [];
    let cx = 0, cy = 0;
    while (true) {
        todo = todo.filter(i => !visited[i]);
        if (!todo.length) break;
        let best = -1, bd = Infinity;
        for (const i of todo) {
            const d = (i % w - cx) ** 2 + ((i / w | 0) - cy) ** 2;
            if (d < bd) { bd = d; best = i; }
        }
        let x = best % w, y = best / w | 0, dx = 0, dy = 0;
        const pts = [[x, y]];
        visited[best] = 1;
        while (true) {
            let nb = null, bs = -Infinity;
            for (let oy = -1; oy <= 1; oy++) {
                for (let ox = -1; ox <= 1; ox++) {
                    if (!ox && !oy) continue;
                    const nx = x + ox, ny = y + oy;
                    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                    const ni = ny * w + nx;
                    if (!edge[ni] || visited[ni]) continue;
                    const score = (ox * dx + oy * dy) / Math.hypot(ox, oy) - (ox && oy ? 0.01 : 0);
                    if (score > bs) { bs = score; nb = [nx, ny, ox, oy]; }
                }
            }
            if (!nb) break;
            x = nb[0]; y = nb[1]; dx = nb[2]; dy = nb[3];
            visited[y * w + x] = 1;
            pts.push([x, y]);
        }
        cx = x; cy = y;
        if (pts.length >= 4) strokes.push(pts);
    }
    return strokes;
}

function simplify(p, eps) {
    if (p.length < 3) return p;
    const a = p[0], b = p[p.length - 1];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9;
    let md = 0, mi = 0;
    for (let i = 1; i < p.length - 1; i++) {
        const d = Math.abs((b[0] - a[0]) * (a[1] - p[i][1]) - (a[0] - p[i][0]) * (b[1] - a[1])) / L;
        if (d > md) { md = d; mi = i; }
    }
    if (md <= eps) return [a, b];
    return simplify(p.slice(0, mi + 1), eps).slice(0, -1).concat(simplify(p.slice(mi), eps));
}

// EDITED: strokes are now {pts, color}; optional wmul = pen width as a multiple of one pixel
function toWorkspace(strokes, w, h, wmul) {
    const s = Math.min(DRAW_BOX.w / w, DRAW_BOX.h / h);
    const ox = DRAW_BOX.x0 + (DRAW_BOX.w - w * s) / 2;
    const oy = DRAW_BOX.y0 + (DRAW_BOX.h - h * s) / 2;
    return strokes.map(st => ({
        color: st.color,
        width: wmul ? s * wmul : 1.2,
        pts: st.pts.map(p => [ox + (p[0] + 0.5) * s, oy + (p[1] + 0.5) * s])
    }));
}

// ---------- 3. Robot motion ----------
function moveArm(x, y) {
    const gx = x + 200, r = Reach(gx, y);
    if (r > 295 || r < 105) {
        const k = (r > 295 ? 295 : 105) / r;
        x = gx * k - 200; y = y * k;
    }
    LL(x, y);
    tcp = [x, y];
}

function newPathEl(color, width) {               // EDITED: colour + width
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", color);
    p.setAttribute("stroke-width", width);
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    drawLayer.appendChild(p);
    return p;
}

function stopDrawing() {
    if (drawJob) cancelAnimationFrame(drawJob);
    drawJob = null;
    PenUp = true;
    const ee = document.getElementById("EE");
    if (ee) ee.setAttribute("fill", "green");
}

function runDrawing(strokes) {
    stopDrawing();
    const moves = [];
    strokes.forEach(s => s.pts.forEach((p, i) =>
        moves.push({ x: p[0], y: p[1], pen: i > 0, color: s.color, width: s.width })));
    if (!moves.length) { setStatus("Nothing to draw - try a lower threshold"); return; }

    let cur = [tcp[0], tcp[1]], k = 0, pathEl = null, d = "", last = performance.now();
    let penColor = "black";
    PenUp = true;

    function frame(now) {
        let t = Math.min(0.05, (now - last) / 1000);
        last = now;
        const speed = val("speed", 200);

        while (t > 0 && k < moves.length) {
            const m = moves[k];
            const vel = m.pen ? speed : speed * 4;
            const dx = m.x - cur[0], dy = m.y - cur[1];
            const dist = Math.hypot(dx, dy);
            const step = vel * t;
            let nx, ny;
            if (dist <= step) { nx = m.x; ny = m.y; t -= dist / vel; k++; }
            else { nx = cur[0] + dx / dist * step; ny = cur[1] + dy / dist * step; t = 0; }

            if (m.pen) {
                PenUp = false;
                penColor = m.color;
                if (!pathEl) { pathEl = newPathEl(m.color, m.width); d = `M${cur[0]},${cur[1]}`; }
                d += ` L${nx},${ny}`;
                pathEl.setAttribute("d", d);
            } else {
                PenUp = true;
                pathEl = null;
            }
            cur = [nx, ny];
        }

        moveArm(cur[0], cur[1]);
        // end-effector shows the pen: green = lifted, otherwise the colour being drawn
        document.getElementById("EE").setAttribute("fill", PenUp ? "green" : penColor);

        if (k < moves.length) {
            setStatus(`Drawing... ${Math.round(100 * k / moves.length)}%`);
            drawJob = requestAnimationFrame(frame);
        } else {
            stopDrawing();
            setStatus("Done!");
        }
    }
    drawJob = requestAnimationFrame(frame);
}

// ---------- 4. UI wiring ----------
document.getElementById("imgInput").addEventListener("change", e => {
    const f = e.target.files[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => { imgEl = img; setStatus("Image loaded - press Draw"); };
    img.onerror = () => setStatus("Could not read that image");
    img.src = URL.createObjectURL(f);
});

document.getElementById("drawBtn").addEventListener("click", () => {
    if (!imgEl) { setStatus("Choose an image first"); return; }
    setStatus("Processing...");
    setTimeout(() => {
        let all = [];
        if (isOn("fillOn", true)) {                       // colour layers first
            const f = imageToGray(imgEl, RES_FILL);
            const { lab, C } = quantize(f.d, f.w * f.h, val("colors", 5));
            all = all.concat(toWorkspace(fillStrokes(lab, C, f.w, f.h), f.w, f.h, 1.15));
        }
        if (isOn("outlineOn", true)) {                    // black outlines on top
            const { g, w, h } = imageToGray(imgEl);
            const edge = detectEdges(blurGray(g, w, h), w, h, val("detail", 30) * 4);
            const lines = traceStrokes(edge, w, h).map(s => ({ pts: simplify(s, 0.8), color: "#000" }));
            all = all.concat(toWorkspace(lines, w, h));
        }
        runDrawing(all);
    }, 20);
});

document.getElementById("stopBtn").addEventListener("click", () => {
    stopDrawing();
    drawLayer.innerHTML = "";
    setStatus("Cleared");
});

// rest pose: the removed start-up stroke used to be what made the arm appear
moveArm(DRAW_BOX.x0 + DRAW_BOX.w / 2, DRAW_BOX.y0 + DRAW_BOX.h / 2);





