export const technicalVertexShader = /* glsl */ `
uniform float uTime;
uniform float uHover;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vObjectPosition = position;

  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;

  vec4 mvPos = viewMatrix * worldPos;
  vViewPosition = -mvPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * mvPos;
}
`;

export const technicalFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform float uProgress;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;
varying vec2 vUv;

// Disciplined cold spectral palette: graphite, steel, cool cyan, ice-silver, subtle violet
vec3 steelPalette(float t) {
  vec3 a = vec3(0.72, 0.75, 0.79);
  vec3 b = vec3(0.10, 0.14, 0.18);
  vec3 c = vec3(0.8, 1.0, 1.1);
  vec3 d = vec3(0.55, 0.70, 0.85);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);

  bool isFront = gl_FrontFacing;
  if (!isFront) {
    N = -N;
  }

  float NdotV = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - NdotV, 3.2);

  // Directional lighting
  vec3 lightDir = normalize(vec3(0.5, 0.75, 0.6));
  vec3 H = normalize(lightDir + V);
  float NdotL = max(dot(N, lightDir), 0.0);
  float NdotH = max(dot(N, H), 0.0);

  // 1. ARCHITECTURAL GRAPHITE & BRUSHED STEEL MATRIX
  vec3 darkGraphite = vec3(0.28, 0.30, 0.33);
  vec3 brushedSteel = vec3(0.74, 0.77, 0.81);
  float facetShade = smoothstep(-0.2, 0.8, dot(N, lightDir));
  vec3 diffuse = mix(darkGraphite, brushedSteel, facetShade);

  // 2. DISCIPLINED COLD PRISMATIC SHEEN
  float viewMetric = (1.0 - NdotV) * 1.2 + abs(vObjectPosition.y * 0.08);
  vec3 prismaticSteel = steelPalette(viewMetric);

  // 3. ENGINEERED INTERNAL ARCHITECTURE / LEVEL DATUM
  float levelCoord = vObjectPosition.y * 1.8 + 0.5;
  float levelGrid = abs(fract(levelCoord) - 0.5);
  float structuralLine = smoothstep(0.04, 0.012, levelGrid);

  float cornerSeamX = smoothstep(0.035, 0.01, abs(abs(vObjectPosition.x) - 0.36));
  float cornerSeamZ = smoothstep(0.035, 0.01, abs(abs(vObjectPosition.z) - 0.74));
  float structuralDatum = max(structuralLine * 0.55, max(cornerSeamX, cornerSeamZ) * 0.65);

  vec3 cyanIntelligence = vec3(0.62, 0.86, 0.96);
  vec3 silverWhite = vec3(0.94, 0.97, 1.0);
  vec3 datumColor = mix(cyanIntelligence, silverWhite, 0.45) * structuralDatum * (0.32 + uHover * 0.58);

  // 4. PRECISION ANISOTROPIC SPECULAR
  float anisoSpec = pow(NdotH, 56.0) * 0.95;
  vec3 specColor = vec3(0.96, 0.98, 1.0) * anisoSpec;

  // 5. CRISP ICE-CYAN EDGE & RIM INTERFERENCE
  vec3 rimTone = mix(vec3(0.68, 0.84, 0.95), vec3(0.82, 0.78, 0.92), (sin(vObjectPosition.y * 1.2 + uTime * 0.3) * 0.5 + 0.5));
  vec3 edgeHighlights = rimTone * fresnel * (0.55 + uHover * 0.4);

  vec3 finalColor = diffuse;
  finalColor = mix(finalColor, prismaticSteel, 0.5 + uHover * 0.25);
  finalColor += datumColor;
  finalColor += specColor;
  finalColor += edgeHighlights;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const technicalLogicPlaneVertexShader = /* glsl */ `
uniform float uTime;
uniform float uHover;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPos.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mvPos;
}
`;

export const technicalLogicPlaneFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform float uLayerIndex;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float NdotV = max(dot(N, V), 0.0);

  // Precision algorithmic grid logic
  vec2 gridUv = vUv * vec2(8.0, 4.0);
  vec2 gridFract = abs(fract(gridUv) - 0.5);
  float lines = smoothstep(0.06, 0.015, min(gridFract.x, gridFract.y));

  // Pulse along data bus lines
  float busWave = sin(vUv.x * 12.0 - uTime * 3.0 + uLayerIndex * 1.5) * 0.5 + 0.5;
  float activeTrace = lines * busWave;

  // Border pinstripes
  float borderDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float border = smoothstep(0.04, 0.01, borderDist);

  // Color composition: Ice cyan, cobalt data lines, luminous silver
  vec3 baseGlass = vec3(0.12, 0.16, 0.22);
  vec3 cyanData = vec3(0.55, 0.88, 0.98);
  vec3 whiteGlint = vec3(0.96, 0.98, 1.0);

  vec3 color = mix(baseGlass, cyanData, activeTrace * 0.85 + border * 0.5);
  color += whiteGlint * (activeTrace * busWave * 0.6);

  float alpha = (0.15 + activeTrace * 0.65 + border * 0.5) * smoothstep(0.05, 0.75, uHover) * 0.88;

  if (alpha < 0.01) discard;

  gl_FragColor = vec4(color, alpha);
}
`;
