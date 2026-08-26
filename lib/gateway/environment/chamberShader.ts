export const chamberBackdropVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;

  // Gentle subtle spatial breathing across the infinite chamber horizon
  vec3 pos = position;
  float breath = sin(uv.x * 3.14159 + uTime * 0.2) * cos(uv.y * 3.14159 - uTime * 0.15) * 0.35;
  pos.z += breath;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const chamberBackdropFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uSelectionBias;
uniform vec2 uPointer;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
  // 1. EDITORIAL MINERAL WHITE FOUNDATION
  vec3 baseMineral = vec3(0.957, 0.949, 0.925); // #f4f2ec
  vec3 deepHorizon = vec3(0.865, 0.852, 0.825);

  // 2. CENTRAL VANISHING PERSPECTIVE CORRIDOR
  vec2 center = vUv - vec2(0.5, 0.5);
  center.x += uPointer.x * 0.04;
  center.y += uPointer.y * 0.03;

  float radialDist = length(center * vec2(1.0, 1.35));
  float tunnelRecess = smoothstep(0.08, 0.65, radialDist);

  vec3 chamberTone = mix(deepHorizon, baseMineral, tunnelRecess * 0.75 + 0.25);

  // 3. LEFT WING (BM VISUALS): WARM ETHEREAL AURORA & NEBULA HAZE
  float leftMask = 1.0 - smoothstep(0.15, 0.65, vUv.x);
  float visualsBias = max(0.0, -uSelectionBias);

  // Soft flowing atmospheric waves
  float wave1 = sin(center.y * 4.2 + uTime * 0.18 + center.x * 2.8);
  float wave2 = cos(center.x * 3.5 - uTime * 0.12 + center.y * 2.1);
  float auroraFlow = (wave1 * 0.5 + wave2 * 0.5) * 0.5 + 0.5;

  vec3 softLavender = vec3(0.91, 0.87, 0.95);
  vec3 warmCoral = vec3(0.97, 0.89, 0.84);
  vec3 opalTeal = vec3(0.88, 0.94, 0.94);

  vec3 visualsAurora = mix(softLavender, warmCoral, sin(uTime * 0.25 + center.y * 2.0) * 0.5 + 0.5);
  visualsAurora = mix(visualsAurora, opalTeal, auroraFlow * 0.4);

  float auroraIntensity = leftMask * (0.42 + visualsBias * 0.48) * (1.0 - smoothstep(0.1, 0.8, radialDist));
  chamberTone = mix(chamberTone, visualsAurora, auroraIntensity);

  // 4. RIGHT WING (BMP TECHNICAL): STRUCTURED CYAN DEPTH & ARCHITECTURAL TRACES
  float rightMask = smoothstep(0.35, 0.85, vUv.x);
  float technicalBias = max(0.0, uSelectionBias);

  // Precision perspective ray channels
  float angle = atan(center.y, center.x);
  float rayGrid = abs(sin(angle * 16.0 + center.y * 2.0));
  float rayLines = smoothstep(0.85, 0.98, rayGrid);

  // Horizontal architectural level datums
  float floorGrid = abs(fract(center.y * 8.0) - 0.5);
  float floorLines = smoothstep(0.04, 0.01, floorGrid) * smoothstep(0.1, 0.8, center.x);

  vec3 coolSteel = vec3(0.88, 0.91, 0.94);
  vec3 iceCyan = vec3(0.82, 0.92, 0.98);
  vec3 silverHighlight = vec3(0.96, 0.98, 1.0);

  vec3 technicalAtmosphere = mix(coolSteel, iceCyan, rayLines * 0.6 + floorLines * 0.4);
  technicalAtmosphere += silverHighlight * (rayLines * floorLines * 0.35);

  float techIntensity = rightMask * (0.38 + technicalBias * 0.45) * (1.0 - smoothstep(0.1, 0.85, radialDist));
  chamberTone = mix(chamberTone, technicalAtmosphere, techIntensity);

  // 5. CENTER BM ANCHOR ZONE (LUMINOUS ORIGIN OF REORGANIZATION)
  float centerBridge = 1.0 - smoothstep(0.0, 0.25, abs(vUv.x - 0.5));
  vec3 originLuminance = vec3(0.98, 0.97, 0.95);
  chamberTone = mix(chamberTone, originLuminance, centerBridge * 0.22 * (1.0 - smoothstep(0.05, 0.4, radialDist)));

  // 6. SUBTLE MICRO-MINERAL TEXTURE
  float grain = (fract(sin(dot(vUv * 600.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.012;
  chamberTone += vec3(grain);

  // Emergence ramp
  float emergenceAlpha = smoothstep(0.5, 0.92, uProgress);
  chamberTone = mix(baseMineral, chamberTone, emergenceAlpha);

  gl_FragColor = vec4(clamp(chamberTone, 0.0, 1.0), 1.0);
}
`;

export const refractivePlyVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;

  // Gentle wave ripple across the spatial ply
  vec3 pos = position;
  float ripple = sin(pos.y * 0.8 + uTime * 0.3) * cos(pos.x * 0.6 + uTime * 0.25) * 0.25;
  pos.z += ripple;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * mvPos;
}
`;

export const refractivePlyFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform vec3 uTint;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float NdotV = max(dot(N, V), 0.0);

  // Soft rim dispersion
  float rim = pow(1.0 - NdotV, 2.5);

  // Subtle thin-film iridescence
  vec3 irid = uTint + vec3(sin(vUv.x * 4.0 + uTime * 0.3) * 0.06, cos(vUv.y * 3.5 + uTime * 0.25) * 0.06, 0.08);

  float alpha = rim * 0.32 * (0.7 + uHover * 0.3);
  if (alpha < 0.008) discard;

  gl_FragColor = vec4(irid, alpha);
}
`;

export const structuralRailVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPos.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mvPos;
}
`;

export const structuralRailFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform float uRailIndex;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  // Animated pulse along the depth rail
  float pulse = abs(fract(vUv.y * 3.0 - uTime * 0.5 + uRailIndex * 0.25) - 0.5);
  float notch = smoothstep(0.12, 0.02, pulse);

  vec3 railBase = vec3(0.68, 0.72, 0.76);
  vec3 cyanSignal = vec3(0.55, 0.88, 0.98);
  vec3 silverSignal = vec3(0.95, 0.98, 1.0);

  vec3 color = mix(railBase, cyanSignal, notch * 0.7 + uHover * 0.3);
  color += silverSignal * (notch * (0.4 + uHover * 0.6));

  float alpha = (0.22 + notch * 0.45 + uHover * 0.33);

  gl_FragColor = vec4(color, alpha);
}
`;
