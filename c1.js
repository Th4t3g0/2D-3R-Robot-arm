
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


// ================== IMAGE DRAWING (append to the END of c1.js) ==================
// Pipeline: image -> grayscale -> blur -> Sobel + thin edges -> trace into strokes
//           -> simplify -> map into the arm's reachable "paper" -> animate with IK

// "Paper" in SVG coordinates. The base sits at (-200,0) and reach is 100..300,
// so this box (corner distances ~136..282 from the base) is safely reachable.
const DRAW_BOX = { x0: -90, y0: -80, w: 160, h: 160 };
const RES = 110;            // image is shrunk so its longest side = RES pixels
let drawJob = null;         // requestAnimationFrame handle
let imgEl = null;           // currently loaded image

const SVGNS = "http://www.w3.org/2000/svg";
const armGroup = svg.querySelector("g");

// paper + layer for the drawing, placed UNDER the arm
const paper = document.createElementNS(SVGNS, "rect");
paper.setAttribute("x", DRAW_BOX.x0); paper.setAttribute("y", DRAW_BOX.y0);
paper.setAttribute("width", DRAW_BOX.w); paper.setAttribute("height", DRAW_BOX.h);
paper.setAttribute("fill", "white"); paper.setAttribute("stroke", "#ddd");
paper.setAttribute("stroke-dasharray", "4 3");
svg.insertBefore(paper, armGroup);
const drawLayer = document.createElementNS(SVGNS, "g");
svg.insertBefore(drawLayer, armGroup);

function setStatus(msg) {
    const s = document.getElementById("status");
    if (s) s.textContent = msg;
}

// ---------- 1. Image processing ----------
function imageToGray(img) {
    const s = RES / Math.max(img.width, img.height);
    const w = Math.max(3, Math.round(img.width * s));
    const h = Math.max(3, Math.round(img.height * s));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);   // transparent PNGs -> white
    ctx.drawImage(img, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    const g = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
        g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    }
    return { g, w, h };
}

function blurGray(g, w, h) {          // 3x3 box blur to kill noise
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

// Sobel gradient + non-maximum suppression => thin (1px) edges
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
            const off = [1, w + 1, w, w - 1][dir[i]];   // neighbours along the gradient
            if (mag[i] > thr && mag[i] > mag[i - off] && mag[i] >= mag[i + off]) edge[i] = 1;
        }
    }
    return edge;
}

// ---------- 2. Turn edge pixels into pen strokes ----------
function traceStrokes(edge, w, h) {
    const visited = new Uint8Array(w * h);
    let todo = [];
    for (let i = 0; i < w * h; i++) if (edge[i]) todo.push(i);
    const strokes = [];
    let cx = 0, cy = 0;                         // where the pen currently is (pixels)

    while (true) {
        todo = todo.filter(i => !visited[i]);
        if (!todo.length) break;

        // start at the unvisited edge pixel closest to the pen (short pen-up travel)
        let best = -1, bd = Infinity;
        for (const i of todo) {
            const d = (i % w - cx) ** 2 + ((i / w | 0) - cy) ** 2;
            if (d < bd) { bd = d; best = i; }
        }
        let x = best % w, y = best / w | 0, dx = 0, dy = 0;
        const pts = [[x, y]];
        visited[best] = 1;

        // keep walking to the neighbour that best continues the current direction
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
        if (pts.length >= 4) strokes.push(pts);   // drop tiny specks of noise
    }
    return strokes;
}

// Ramer-Douglas-Peucker: fewer points => smoother, faster robot motion
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

// pixel coords -> SVG workspace coords (keeps aspect ratio, centred on the paper)
function toWorkspace(strokes, w, h) {
    const s = Math.min(DRAW_BOX.w / w, DRAW_BOX.h / h);
    const ox = DRAW_BOX.x0 + (DRAW_BOX.w - w * s) / 2;
    const oy = DRAW_BOX.y0 + (DRAW_BOX.h - h * s) / 2;
    return strokes.map(st => st.map(p => [ox + p[0] * s, oy + p[1] * s]));
}

// ---------- 3. Robot motion ----------
// Safety: keep targets inside the arm's reach (base is at (-200,0), reach 100..300)
function moveArm(x, y) {
    const gx = x + 200, r = Reach(gx, y);
    if (r > 295 || r < 105) {
        const k = (r > 295 ? 295 : 105) / r;
        x = gx * k - 200; y = y * k;
    }
    LL(x, y);              // existing: IK -> joint positions -> DrawLoop
    tcp = [x, y];
}

function newPathEl() {
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "black");
    p.setAttribute("stroke-width", "1.2");
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
    // waypoint list: first point of each stroke = pen-up travel, the rest = pen-down
    const moves = [];
    strokes.forEach(s => s.forEach((p, i) => moves.push({ x: p[0], y: p[1], pen: i > 0 })));
    if (!moves.length) { setStatus("No edges found - lower the threshold"); return; }

    let cur = [tcp[0], tcp[1]], k = 0, pathEl = null, d = "", last = performance.now();
    PenUp = true;

    function frame(now) {
        let t = Math.min(0.05, (now - last) / 1000);   // seconds to spend this frame
        last = now;
        const speed = +document.getElementById("speed").value;   // units/sec while drawing

        while (t > 0 && k < moves.length) {
            const m = moves[k];
            const vel = m.pen ? speed : speed * 4;                // travel faster pen-up
            const dx = m.x - cur[0], dy = m.y - cur[1];
            const dist = Math.hypot(dx, dy);
            const step = vel * t;
            let nx, ny;
            if (dist <= step) { nx = m.x; ny = m.y; t -= dist / vel; k++; }
            else { nx = cur[0] + dx / dist * step; ny = cur[1] + dy / dist * step; t = 0; }

            if (m.pen) {
                PenUp = false;
                if (!pathEl) { pathEl = newPathEl(); d = `M${cur[0]},${cur[1]}`; }
                d += ` L${nx},${ny}`;
                pathEl.setAttribute("d", d);
            } else {
                PenUp = true;
                pathEl = null;
            }
            cur = [nx, ny];
        }

        moveArm(cur[0], cur[1]);
        document.getElementById("EE").setAttribute("fill", PenUp ? "green" : "red");

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
    setTimeout(() => {   // let the status text paint first
        const { g, w, h } = imageToGray(imgEl);
        const thr = +document.getElementById("detail").value * 4;
        const edge = detectEdges(blurGray(g, w, h), w, h, thr);
        const strokes = traceStrokes(edge, w, h).map(s => simplify(s, 0.8));
        runDrawing(toWorkspace(strokes, w, h));
    }, 20);
});

document.getElementById("stopBtn").addEventListener("click", () => {
    stopDrawing();
    drawLayer.innerHTML = "";
    setStatus("Cleared");
});







