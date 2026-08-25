export const livingMatterVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uTension;
uniform float uAperture;
uniform vec2 uPointer;
uniform float uIdentityLeak;
uniform float uReducedMotion;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vDisplacement;
varying float vApertureDistance;
varying float vShearField;

// 3D Simplex noise functions for continuous organic tension
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Mathematical Gyroid-Schwarz higher manifold
float gyroidField(vec3 p, float scale, float phase) {
  vec3 q = p * scale;
  return sin(q.x + phase) * cos(q.y) + sin(q.y + phase * 0.7) * cos(q.z) + sin(q.z + phase * 1.3) * cos(q.x);
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float motionScale = uReducedMotion > 0.5 ? 0.05 : 1.0;
  float t = uTime * 0.4 * motionScale;

  // Compute cursor tension influence (viscous, memory-based)
  vec2 pointerDiff = pos.xy - uPointer * vec2(4.0, 3.0);
  float pointerDist = length(pointerDiff);
  float pointerTension = exp(-pointerDist * 0.6) * uTension * 1.4;

  // Multi-frequency topological folding
  float g1 = gyroidField(pos + vec3(0.0, 0.0, uProgress * 4.0), 0.42, t);
  float g2 = gyroidField(pos * 1.8 + vec3(g1 * 0.5), 0.85, t * 1.4);
  float noiseVal = snoise(pos * 0.35 + vec3(0.0, 0.0, t * 0.2));

  // Shear field representing internal stress / crystallization
  float shear = sin(pos.y * 1.2 + g1 * 1.5 + pointerTension) * cos(pos.x * 0.9 - g2);
  vShearField = shear;

  // Aperture topological displacement (opens central void while peeling folds outward)
  float centerDist = length(pos.xy);
  vApertureDistance = centerDist;
  float apertureFactor = smoothstep(0.1, 0.9, uAperture);
  
  // Non-linear tear along non-Euclidean curvature
  float tearCurve = sin(pos.z * 0.4 + g1 * 2.0) * 0.8;
  vec2 radialDir = centerDist > 0.001 ? normalize(pos.xy + vec2(tearCurve * 0.5, 0.0)) : vec2(0.0, 1.0);
  
  float aperturePush = smoothstep(0.0, 3.5, centerDist) * apertureFactor * 3.8;
  pos.xy += radialDir * aperturePush;
  pos.z += (1.0 - smoothstep(0.0, 4.0, centerDist)) * apertureFactor * 2.2;

  // Combine displacement along normal and world coordinates
  float disp = (g1 * 0.65 + g2 * 0.25 + noiseVal * 0.35 + pointerTension * 0.4) * (1.0 - apertureFactor * 0.3);
  vDisplacement = disp;

  pos += normal * (disp * 0.55);

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;

  vec4 mvPos = viewMatrix * worldPos;
  vViewPosition = -mvPos.xyz;

  // Approximate transformed normal
  vec3 transformedNormal = normalMatrix * normal;
  transformedNormal = normalize(transformedNormal + vec3(shear * 0.15, disp * 0.1, 0.0));
  vNormal = transformedNormal;

  gl_Position = projectionMatrix * mvPos;
}
`;

export const livingMatterFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uTension;
uniform float uAperture;
uniform float uEventDarkness;
uniform float uReducedMotion;
uniform vec3 uColorBase;
uniform vec3 uColorPearl;
uniform vec3 uColorGraphite;
uniform vec3 uColorRefract;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vDisplacement;
varying float vApertureDistance;
varying float vShearField;

// Iridescent micro-facet approximation
vec3 iridescentSheen(float cosTheta, float shear) {
  vec3 f0 = vec3(0.97, 0.96, 0.93);
  vec3 shift = vec3(
    sin(cosTheta * 6.28 + shear * 2.0),
    sin(cosTheta * 6.28 + shear * 2.0 + 1.2),
    sin(cosTheta * 6.28 + shear * 2.0 + 2.4)
  ) * 0.045;
  return f0 + shift;
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);

  // Backface handling for double-sided translucent sheets
  if (!gl_FrontFacing) {
    N = -N;
  }

  // Viewing angle and Fresnel response
  float NdotV = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - NdotV, 3.5);

  // Key directional light representing the ambient mineral illumination
  vec3 lightDir1 = normalize(vec3(0.4, 0.8, 0.6));
  vec3 lightDir2 = normalize(vec3(-0.6, -0.2, 0.7));
  
  float NdotL1 = max(dot(N, lightDir1), 0.0);
  float NdotL2 = max(dot(N, lightDir2), 0.0);

  // Subsurface scattering approximation (translucent pearl / alabaster depth)
  vec3 sssLight = normalize(lightDir1 + N * 0.4);
  float sssDot = max(0.0, dot(V, -sssLight));
  float sss = pow(sssDot, 3.0) * 0.55;

  // Anisotropic specular sheen along shear planes
  vec3 H = normalize(lightDir1 + V);
  float NdotH = max(dot(N, H), 0.0);
  float anisoSpec = pow(NdotH, 28.0) * (0.8 + 0.4 * sin(vShearField * 4.0));

  // Chromatic refraction simulation: R, G, B dispersion through mineral folds
  vec3 refractR = refract(-V, N, 0.90);
  vec3 refractG = refract(-V, N, 0.88);
  vec3 refractB = refract(-V, N, 0.86);

  float dispersionFringe = length(refractR - refractB) * 0.7;
  vec3 chromaticColor = vec3(
    dot(refractR, vec3(0.3, 0.5, 0.2)),
    dot(refractG, vec3(0.2, 0.6, 0.2)),
    dot(refractB, vec3(0.2, 0.3, 0.5))
  ) * 0.12;

  // Base palette: Warm alabaster / mineral white
  vec3 alabaster = uColorBase;
  vec3 pearl = uColorPearl;
  vec3 graphite = uColorGraphite;

  // Form shading with pearlescent response
  vec3 matterColor = mix(alabaster, pearl, smoothstep(-0.5, 0.5, vDisplacement));
  matterColor += iridescentSheen(NdotV, vShearField) * fresnel * 0.65;
  matterColor += uColorRefract * dispersionFringe;
  matterColor += chromaticColor;
  matterColor += anisoSpec * vec3(0.98, 0.98, 0.96);
  matterColor += sss * vec3(0.99, 0.97, 0.94);

  // Controlled graphite shadows in deep crevices / high stress zones
  float creviceOcc = smoothstep(-0.7, -0.1, vDisplacement) * (1.0 - smoothstep(0.0, 0.8, NdotV));
  matterColor = mix(matterColor, graphite, creviceOcc * 0.42);

  // Event Darkness transition (during deep pass-through interior)
  matterColor = mix(matterColor, graphite * 1.8 + vec3(0.05), uEventDarkness * 0.88);

  // Dynamic opacity / transmission based on aperture, dormant state, and grazing angles
  // Dormant stage (uProgress < 0.15): matter is almost invisible with subtle caustic shimmer
  float dormantAlpha = smoothstep(0.0, 0.18, uProgress);
  float dormantBase = mix(0.12 + 0.35 * fresnel, 1.0, dormantAlpha);

  // Aperture topological tear: center becomes negative space
  float tearAlpha = 1.0;
  if (uAperture > 0.01) {
    float opening = smoothstep(0.0, 1.8 * uAperture, vApertureDistance);
    tearAlpha = mix(0.0, 1.0, opening);
  }

  // Emergence stage (uProgress > 0.88): center clears, matter recedes gracefully to perimeter
  float emergenceFade = 1.0;
  if (uProgress > 0.85) {
    float t = (uProgress - 0.85) / 0.15;
    emergenceFade = mix(1.0, smoothstep(0.5, 3.2, vApertureDistance), t);
  }

  float alpha = clamp(dormantBase * tearAlpha * emergenceFade * (0.45 + 0.55 * fresnel + 0.3 * anisoSpec), 0.0, 1.0);

  // Discard near-invisible fragments for crisp topological boundaries and performance
  if (alpha < 0.015) {
    discard;
  }

  gl_FragColor = vec4(matterColor, alpha);
}
`;

export const refractionFilmVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uAperture;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Gentle wave ripple across the transmission plies
  float wave = sin(pos.y * 0.8 + uTime * 0.5) * cos(pos.x * 0.7 + uTime * 0.4) * 0.25;
  pos.z += wave;

  // Expand with aperture
  if (uAperture > 0.05) {
    float dist = length(pos.xy);
    pos.xy += normalize(pos.xy + vec2(0.001)) * (dist * uAperture * 0.6);
  }

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const refractionFilmFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uEventDarkness;
uniform vec3 uColorBase;
uniform vec3 uColorPearl;
uniform vec3 uColorGraphite;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vWorldPosition);
  float NdotV = max(dot(N, V), 0.0);
  float rim = pow(1.0 - NdotV, 4.0);

  vec3 color = mix(uColorBase, uColorPearl, rim);
  color = mix(color, uColorGraphite * 1.5, uEventDarkness * 0.85);

  float alpha = rim * 0.45 * smoothstep(0.05, 0.25, uProgress) * (1.0 - smoothstep(0.85, 0.98, uProgress));

  if (alpha < 0.01) discard;

  gl_FragColor = vec4(color, alpha);
}
`;
