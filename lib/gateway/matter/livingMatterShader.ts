export const livingMatterVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uTension;
uniform float uAperture;
uniform vec2 uPointer;
uniform float uIdentityLeak;
uniform float uSelectionBias;
uniform float uReducedMotion;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vDisplacement;
varying float vShearField;
varying float vMaterialPhase;
varying float vInversionWeight;
varying float vDepthMetric;

// High quality 3D Simplex noise
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

// Asymmetric Non-Euclidean fold field
float asymmetricFoldField(vec3 p, float t) {
  // Asymmetric skew: no circular symmetry
  vec3 q = p;
  q.x += sin(p.z * 0.35 + p.y * 0.4) * 1.2;
  q.y += cos(p.z * 0.28 - p.x * 0.35) * 0.9;
  
  float f1 = sin(q.x * 0.45 + t) * cos(q.y * 0.6) + sin(q.y * 0.5 + t * 0.8) * cos(q.z * 0.4);
  float f2 = sin(q.z * 0.7 - t * 0.5) * cos(q.x * 0.8) + snoise(q * 0.3 + vec3(0.0, 0.0, t * 0.15)) * 0.6;
  return f1 + f2 * 0.5;
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float motionScale = uReducedMotion > 0.5 ? 0.05 : 1.0;
  float t = uTime * 0.35 * motionScale;

  // Viscous pointer interaction memory
  vec2 pointerDiff = pos.xy - uPointer * vec2(3.5, 2.5);
  float pointerDist = length(pointerDiff);
  float pointerTension = exp(-pointerDist * 0.7) * uTension * 1.6;

  // 1. Asymmetric multi-harmonic fold evaluation
  float fold = asymmetricFoldField(pos + vec3(0.0, 0.0, uProgress * 5.0), t);
  float microNoise = snoise(pos * 0.8 + vec3(fold * 0.4, 0.0, t * 0.2));
  
  // 2. Authored Impossible Traversal Event: Spatial Inversion (Progress 0.46 - 0.58)
  // An apparent opening seals abruptly, then topology turns inside-out from flanks around camera
  float inversionTrigger = smoothstep(0.44, 0.51, uProgress) * (1.0 - smoothstep(0.55, 0.64, uProgress));
  vInversionWeight = inversionTrigger;
  
  // Asymmetric topological pinch & flip
  float pinch = exp(-pow((uProgress - 0.49) * 22.0, 2.0));
  vec2 shearOffset = vec2(sin(pos.z * 0.6 + t), cos(pos.z * 0.5 - t * 0.8)) * 1.5;
  pos.xy += shearOffset * pinch;

  // Hyperbolic spatial turnover during inversion
  if (inversionTrigger > 0.001) {
    vec2 invertedXY = vec2(-pos.y * 1.2, pos.x * 0.8) + vec2(sin(pos.z), cos(pos.z)) * 0.6;
    pos.xy = mix(pos.xy, invertedXY, inversionTrigger * 0.65);
    pos.z += sin(length(pos.xy) * 2.0 + t) * inversionTrigger * 1.8;
  }

  // 3. Two-World Split Morphology (Progress 0.85 -> 1.0)
  // Left (Visuals): Relaxed, broad, continuous undulating sheets
  // Right (Technical): Tensioned, sharp planar crystalline facets, precise grid-like axes
  if (uIdentityLeak > 0.01) {
    float isLeft = smoothstep(0.2, -0.6, pos.x);
    float isRight = smoothstep(-0.2, 0.6, pos.x);

    // Visuals relaxation on left
    float visualWave = sin(pos.y * 0.5 + t * 0.6) * cos(pos.z * 0.3) * 1.4;
    pos.y += visualWave * isLeft * uIdentityLeak;

    // Technical crystallization on right (quantized planar facets)
    float techFacet = floor((pos.y + pos.z * 0.5 + fold * 0.8) * 2.2) / 2.2;
    pos.x += (techFacet - pos.y) * 0.35 * isRight * uIdentityLeak;
  }

  // 4. Multi-Phase Material Mapping
  // Deriving continuous material phases across the geometry:
  // 0.0 - 0.25: Pure Refraction Distort
  // 0.25 - 0.55: Translucent Pearl / Subsurface
  // 0.55 - 0.80: Soft Mineral Alabaster
  // 0.80 - 1.00: Crystalline Anisotropic Edge
  float phaseVal = clamp(
    0.5 + 0.35 * fold + 0.2 * microNoise + (pos.x * 0.08) - (pos.z * 0.04),
    0.0,
    1.0
  );
  vMaterialPhase = phaseVal;
  vShearField = fold;
  vDisplacement = fold * 0.7 + microNoise * 0.3 + pointerTension * 0.5;

  // Vertex normal displacement
  pos += normal * (vDisplacement * 0.45);

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vDepthMetric = -worldPos.z;

  vec4 mvPos = viewMatrix * worldPos;
  vViewPosition = -mvPos.xyz;

  // Analytical transformed normal with shear slope
  vec3 transformedNormal = normalMatrix * normal;
  transformedNormal = normalize(
    transformedNormal + vec3(fold * 0.2, microNoise * 0.15, pointerTension * 0.1)
  );
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
uniform float uIdentityLeak;
uniform float uSelectionBias;
uniform vec3 uColorBase;
uniform vec3 uColorPearl;
uniform vec3 uColorGraphite;
uniform vec3 uColorRefract;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vDisplacement;
varying float vShearField;
varying float vMaterialPhase;
varying float vInversionWeight;
varying float vDepthMetric;

// Thin-film anisotropic mineral sheen
vec3 mineralSheen(float cosTheta, float shear, float phase) {
  vec3 silverWhite = vec3(0.98, 0.98, 0.96);
  vec3 subtleDiffract = vec3(
    sin(cosTheta * 5.5 + shear * 2.5),
    sin(cosTheta * 5.5 + shear * 2.5 + 0.8),
    sin(cosTheta * 5.5 + shear * 2.5 + 1.8)
  ) * 0.035;
  return silverWhite + subtleDiffract * (1.0 - phase);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);

  if (!gl_FrontFacing) {
    N = -N;
  }

  float NdotV = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - NdotV, 3.8);

  // Key directional and fill lighting
  vec3 lightDir1 = normalize(vec3(0.35, 0.85, 0.55));
  vec3 lightDir2 = normalize(vec3(-0.7, -0.25, 0.65));
  
  float NdotL1 = max(dot(N, lightDir1), 0.0);
  float NdotL2 = max(dot(N, lightDir2), 0.0);

  // 1. Multi-Phase Shading Evaluation
  // Phase 1: Translucent Pearl / Subsurface
  vec3 sssLight = normalize(lightDir1 + N * 0.35);
  float sssDot = max(0.0, dot(V, -sssLight));
  float sss = pow(sssDot, 3.2) * 0.6;
  vec3 sssColor = vec3(0.99, 0.96, 0.92) * sss;

  // Phase 2: Anisotropic Crystalline Sheen
  vec3 H = normalize(lightDir1 + V);
  float NdotH = max(dot(N, H), 0.0);
  float anisoSpec = pow(NdotH, 32.0) * (0.85 + 0.35 * sin(vShearField * 5.0));
  vec3 sheen = mineralSheen(NdotV, vShearField, vMaterialPhase) * anisoSpec;

  // Phase 3: Chromatic Refraction Anticipation (Non-Euclidean internal look-ahead)
  // Refraction angle anticipates interior folds before direct arrival
  vec3 refractR = refract(-V, N, 0.91);
  vec3 refractG = refract(-V, N, 0.89);
  vec3 refractB = refract(-V, N, 0.87);

  float dispersionFringe = length(refractR - refractB) * 0.9;
  vec3 chromaticColor = vec3(
    dot(refractR, vec3(0.35, 0.45, 0.2)),
    dot(refractG, vec3(0.2, 0.6, 0.2)),
    dot(refractB, vec3(0.2, 0.35, 0.45))
  ) * 0.15;

  // Base palette assembly
  vec3 alabaster = uColorBase;
  vec3 pearl = uColorPearl;
  vec3 graphite = uColorGraphite;

  // Blend between material phases (Optic -> Pearl -> Opaque Mineral -> Crystalline)
  vec3 matterColor = mix(alabaster, pearl, smoothstep(0.2, 0.7, vMaterialPhase));
  matterColor += sheen * 0.9;
  matterColor += sssColor * (1.0 - smoothstep(0.6, 0.9, vMaterialPhase));
  matterColor += uColorRefract * dispersionFringe;
  matterColor += chromaticColor;
  matterColor += fresnel * vec3(0.98, 0.98, 0.95) * 0.55;

  // 2. Controlled Graphite Cavity Shadowing & Event Darkness
  float creviceOcc = smoothstep(-0.6, -0.05, vDisplacement) * (1.0 - smoothstep(0.0, 0.75, NdotV));
  matterColor = mix(matterColor, graphite, creviceOcc * 0.45);

  // During Inversion & Deep Pass-Through event: graphite transition
  float totalDarkness = max(uEventDarkness, vInversionWeight * 0.45);
  matterColor = mix(matterColor, graphite * 1.7 + vec3(0.04), totalDarkness * 0.88);

  // 3. Two-World Split Behavior Differentiation
  if (uIdentityLeak > 0.01) {
    float isLeft = smoothstep(0.0, -2.0, vWorldPosition.x);
    float isRight = smoothstep(0.0, 2.0, vWorldPosition.x);
    // Visuals (Left): softer, warmer, milky pearl glow
    matterColor = mix(matterColor, vec3(0.97, 0.95, 0.92) + sssColor * 0.4, isLeft * uIdentityLeak * 0.45);
    // Technical (Right): cooler, sharper, structured graphite-mineral contrast
    matterColor = mix(matterColor, vec3(0.90, 0.92, 0.94) + sheen * 0.5, isRight * uIdentityLeak * 0.45);
  }

  // 4. Sophisticated Transparency & Macro-Depth Separation
  // Dormant stage (uProgress < 0.15): nearly invisible with delicate shimmering refraction
  float dormantAlpha = smoothstep(0.0, 0.16, uProgress);
  float dormantBase = mix(0.08 + 0.35 * fresnel, 1.0, dormantAlpha);

  // Macro-foreground membrane transparency: when passing very close, keep edge crisp and body translucent
  float depthFade = smoothstep(0.2, 2.0, vDepthMetric);

  // Emergence clean-up (uProgress > 0.88): center clears, matter frames the perimeter
  float emergenceFade = 1.0;
  if (uProgress > 0.85) {
    float t = (uProgress - 0.85) / 0.15;
    float centerDistance = length(vWorldPosition.xy);
    emergenceFade = mix(1.0, smoothstep(0.8, 3.8, centerDistance), t);
  }

  // Multi-phase alpha
  float phaseAlpha = mix(0.35, 0.95, vMaterialPhase);
  float alpha = clamp(
    dormantBase * emergenceFade * phaseAlpha * (0.35 + 0.65 * fresnel + 0.4 * anisoSpec),
    0.0,
    1.0
  );

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
varying float vWaveMetric;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Asymmetric shear wave
  float wave = sin(pos.y * 0.6 + uTime * 0.4 + pos.x * 0.5) * cos(pos.z * 0.35 + uTime * 0.3) * 0.4;
  pos.z += wave;
  vWaveMetric = wave;

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
varying float vWaveMetric;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vWorldPosition);
  float NdotV = max(dot(N, V), 0.0);
  float rim = pow(1.0 - NdotV, 3.5);

  vec3 color = mix(uColorBase, uColorPearl, rim + vWaveMetric * 0.3);
  color = mix(color, uColorGraphite * 1.6, uEventDarkness * 0.85);

  float alpha = rim * 0.48 * smoothstep(0.04, 0.22, uProgress) * (1.0 - smoothstep(0.86, 0.98, uProgress));

  if (alpha < 0.012) discard;

  gl_FragColor = vec4(color, alpha);
}
`;
