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
  // Angle-dependent steel-cyan interference along planar facets
  float viewMetric = (1.0 - NdotV) * 1.2 + abs(vObjectPosition.y * 0.08);
  vec3 prismaticSteel = steelPalette(viewMetric);

  // 3. ENGINEERED INTERNAL ARCHITECTURE / LEVEL DATUM
  // Horizontal floor plates / structural logic
  float levelCoord = vObjectPosition.y * 1.8 + 0.5;
  float levelGrid = abs(fract(levelCoord) - 0.5);
  float structuralLine = smoothstep(0.04, 0.012, levelGrid);

  // Vertical engineering datum seams along the monolith corners
  float cornerSeamX = smoothstep(0.035, 0.01, abs(abs(vObjectPosition.x) - 0.74));
  float cornerSeamZ = smoothstep(0.035, 0.01, abs(abs(vObjectPosition.z) - 0.74));
  float structuralDatum = max(structuralLine * 0.55, max(cornerSeamX, cornerSeamZ) * 0.65);

  // Luminous cool cyan & silver structural illumination
  vec3 cyanIntelligence = vec3(0.62, 0.86, 0.96);
  vec3 silverWhite = vec3(0.94, 0.97, 1.0);
  vec3 datumColor = mix(cyanIntelligence, silverWhite, 0.45) * structuralDatum * (0.32 + uHover * 0.58);

  // 4. PRECISION ANISOTROPIC SPECULAR (Micro-machined mineral glint)
  float anisoSpec = pow(NdotH, 56.0) * 0.95;
  vec3 specColor = vec3(0.96, 0.98, 1.0) * anisoSpec;

  // 5. CRISP ICE-CYAN EDGE & RIM INTERFERENCE
  vec3 rimTone = mix(vec3(0.68, 0.84, 0.95), vec3(0.82, 0.78, 0.92), (sin(vObjectPosition.y * 1.2 + uTime * 0.3) * 0.5 + 0.5));
  vec3 edgeHighlights = rimTone * fresnel * (0.55 + uHover * 0.4);

  // 6. COMPOSITION
  vec3 finalColor = diffuse;
  // Blend in cold prismatic steel
  finalColor = mix(finalColor, prismaticSteel, 0.5 + uHover * 0.25);
  // Add structural lines & edge glints
  finalColor += datumColor;
  finalColor += specColor;
  finalColor += edgeHighlights;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
