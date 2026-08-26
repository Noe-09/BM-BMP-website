export const chamberWallVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;

  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;

  vec4 mvPos = viewMatrix * worldPos;
  vViewPosition = -mvPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * mvPos;
}
`;

export const chamberWallFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uSelectionBias;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);

  if (!gl_FrontFacing) {
    N = -N;
  }

  float NdotV = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - NdotV, 2.6);

  // Balanced directional illumination
  vec3 keyLightDir = normalize(vec3(-0.35, 0.75, 0.55));
  vec3 fillLightDir = normalize(vec3(0.45, 0.25, 0.65));

  float NdotL1 = max(dot(N, keyLightDir), 0.0);
  float NdotL2 = max(dot(N, fillLightDir), 0.0);

  // 1. SCULPTURAL EDITORIAL MINERAL FOUNDATION (#f4f2ec)
  vec3 baseMineral = vec3(0.957, 0.949, 0.925);
  vec3 deepCrevice = vec3(0.855, 0.842, 0.815);
  
  // Real 3D depth-based ambient occlusion
  float depthMetric = smoothstep(-20.0, -36.0, vWorldPosition.z);
  vec3 diffuse = mix(baseMineral, deepCrevice, depthMetric * 0.45);
  diffuse = mix(diffuse * 0.92, diffuse * 1.04, NdotL1 * 0.65 + NdotL2 * 0.35);

  // 2. ASYMMETRIC LATERAL TONALITY
  // Left: warm rose-lavender atmospheric alcove
  // Right: cool ice-cyan structural colonnade
  float lateralX = smoothstep(-7.0, 7.0, vWorldPosition.x);
  vec3 warmSide = mix(baseMineral, vec3(0.93, 0.88, 0.95), 0.45);
  vec3 coolSide = mix(baseMineral, vec3(0.87, 0.92, 0.96), 0.45);
  vec3 lateralTone = mix(warmSide, coolSide, lateralX);

  // Dynamic selection response
  float visualsHover = max(0.0, -uSelectionBias);
  float techHover = max(0.0, uSelectionBias);

  if (vWorldPosition.x < 0.0) {
    lateralTone = mix(lateralTone, vec3(0.96, 0.88, 0.84), visualsHover * 0.42);
  } else {
    lateralTone = mix(lateralTone, vec3(0.80, 0.91, 0.98), techHover * 0.42);
  }

  // 3. FINE ARCHITECTURAL STONE PANEL SEAMS (Subtle hairline joint lines)
  float panelY = abs(fract(vWorldPosition.y * 0.35 + 0.5) - 0.5);
  float panelJoint = smoothstep(0.015, 0.003, panelY) * 0.045;

  // 4. SURFACE COMPOSITION
  vec3 finalColor = mix(diffuse, lateralTone, 0.45);
  finalColor += fresnel * vec3(0.98, 0.98, 0.96) * 0.28;
  finalColor -= panelJoint * vec3(0.12);

  // Subtle micro-mineral grain
  float grain = (fract(sin(dot(vWorldPosition.xy * 25.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.01;
  finalColor += vec3(grain);

  // Emergence ramp
  float emergence = smoothstep(0.65, 0.92, uProgress);
  finalColor = mix(baseMineral, finalColor, emergence);

  gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}
`;

export const centerSeamVertexShader = /* glsl */ `
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;

  vec3 pos = position;
  float ripple = sin(pos.y * 1.5 + uTime * 0.8) * 0.05;
  pos.x += ripple;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * mvPos;
}
`;

export const centerSeamFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uSelectionBias;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  // Central luminous origin core pulse
  float centerDist = abs(vUv.x - 0.5) * 2.0;
  float coreBeam = smoothstep(0.85, 0.02, centerDist);

  float pulse = sin(vUv.y * 6.0 - uTime * 1.8) * 0.5 + 0.5;

  // Ethereal pearlescent core with chromatic dispersion
  vec3 beamColor = vec3(0.985, 0.975, 0.96);
  vec3 fringeColor = mix(vec3(0.92, 0.85, 0.98), vec3(0.80, 0.94, 0.98), sin(vUv.y * 3.5 + uTime) * 0.5 + 0.5);

  vec3 color = mix(beamColor, fringeColor, pulse * 0.35);

  float alpha = coreBeam * (0.18 + pulse * 0.22) * smoothstep(0.65, 0.95, uProgress);
  if (alpha < 0.005) discard;

  gl_FragColor = vec4(color, alpha);
}
`;

export const canopyVertexShader = /* glsl */ `
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;

  vec3 pos = position;
  float wave = sin(pos.x * 0.4 + pos.y * 0.3 + uTime * 0.2) * 0.12;
  pos.z += wave;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;

  vec4 mvPos = viewMatrix * worldPos;
  vViewPosition = -mvPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * mvPos;
}
`;

export const canopyFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uHover;
uniform vec3 uTint;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);

  if (!gl_FrontFacing) {
    N = -N;
  }

  float NdotV = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - NdotV, 2.2);

  // Soft thin-film pearlescence
  vec3 irid = uTint + vec3(
    sin(vUv.x * 3.5 + uTime * 0.25) * 0.07,
    cos(vUv.y * 3.0 + uTime * 0.2) * 0.07,
    0.08
  );

  float alpha = (0.18 + fresnel * 0.45 + uHover * 0.22) * smoothstep(0.65, 0.95, uProgress);
  if (alpha < 0.005) discard;

  gl_FragColor = vec4(irid, alpha);
}
`;
