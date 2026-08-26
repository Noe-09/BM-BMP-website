export const livingMatterVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uTension;
uniform float uAperture;
uniform vec2 uPointer;
uniform float uIdentityLeak;
uniform float uSelectionBias;
uniform float uInstability;
uniform float uSingularityX;
uniform float uReducedMotion;

attribute float aEntityType;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vDisplacement;
varying float vShearField;
varying float vMaterialPhase;
varying float vInversionWeight;
varying float vTensionSeam;
varying float vSingularityDistance;
varying float vDepthMetric;
varying float vEntityType;

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
  vec3 q = p;
  q.x += sin(p.z * 0.35 + p.y * 0.4) * 1.2;
  q.y += cos(p.z * 0.28 - p.x * 0.35) * 0.9;
  
  float f1 = sin(q.x * 0.45 + t) * cos(q.y * 0.6) + sin(q.y * 0.5 + t * 0.8) * cos(q.z * 0.4);
  float f2 = sin(q.z * 0.7 - t * 0.5) * cos(q.x * 0.8) + snoise(q * 0.3 + vec3(0.0, 0.0, t * 0.15)) * 0.6;
  return f1 + f2 * 0.5;
}

void main() {
  vUv = uv;
  vEntityType = aEntityType;
  vec3 pos = position;

  float motionScale = uReducedMotion > 0.5 ? 0.05 : 1.0;
  float t = uTime * 0.35 * motionScale;

  // Pointer tension influence
  vec2 pointerDiff = pos.xy - uPointer * vec2(3.5, 2.5);
  float pointerDist = length(pointerDiff);
  float pointerTension = exp(-pointerDist * 0.7) * uTension * 1.6;

  // 1. Asymmetric multi-harmonic fold evaluation
  float fold = asymmetricFoldField(pos + vec3(0.0, 0.0, uProgress * 5.0), t);
  float microNoise = snoise(pos * 0.8 + vec3(fold * 0.4, 0.0, t * 0.2));
  
  // 2. Spatial Inversion Traversal Event (Progress 0.46 - 0.58)
  float inversionTrigger = smoothstep(0.44, 0.51, uProgress) * (1.0 - smoothstep(0.55, 0.64, uProgress));
  vInversionWeight = inversionTrigger;
  
  float pinch = exp(-pow((uProgress - 0.49) * 22.0, 2.0));
  vec2 shearOffset = vec2(sin(pos.z * 0.6 + t), cos(pos.z * 0.5 - t * 0.8)) * 1.5;
  pos.xy += shearOffset * pinch;

  if (inversionTrigger > 0.001) {
    vec2 invertedXY = vec2(-pos.y * 1.2, pos.x * 0.8) + vec2(sin(pos.z), cos(pos.z)) * 0.6;
    pos.xy = mix(pos.xy, invertedXY, inversionTrigger * 0.65);
    pos.z += sin(length(pos.xy) * 2.0 + t) * inversionTrigger * 1.8;
  }

  // 3. BM PHASE SINGULARITY & TENSION SEAM (The Tension Field)
  // The central anchor point where physical laws transition
  vec2 singularityPos = vec2(uSingularityX, 0.0);
  float distToSingularity = length(pos.xy - singularityPos);
  vSingularityDistance = distToSingularity;

  // Tension Seam along the dynamic transition meridian
  float seamCoordinate = pos.x - uSingularityX - sin(pos.y * 0.35 + t * 0.5) * 0.4;
  vTensionSeam = exp(-abs(seamCoordinate) * 1.2);

  // Side-Switch Neutral Instability Event (approx 350-500ms wave pulse)
  if (uInstability > 0.001) {
    float instabilityPulse = sin(distToSingularity * 3.2 - t * 7.0) * uInstability * 1.2;
    pos.z += instabilityPulse * exp(-distToSingularity * 0.3);
    pos.xy += vec2(cos(distToSingularity * 2.0), sin(distToSingularity * 2.0)) * (uInstability * 0.45);
  }

  // 4. TWO-BEHAVIOR FIELD MUTATION (COLLAPSED HERO FIELD)
  if (uProgress > 0.82) {
    float fieldInfluence = smoothstep(0.82, 0.96, uProgress);
    
    if (abs(aEntityType) < 0.1) {
      float bridgeWave = sin(pos.y * 0.35 + pos.x * 0.3 + t * 0.4) * cos(pos.x * 0.25 - pos.y * 0.2) * 1.4;
      pos.z += bridgeWave * fieldInfluence * 0.75;
    }

    // VISUALS ATTRACTOR (Upper-Left Bias, uSelectionBias < 0):
    // Relaxation, expansion, continuous organic wave unfolding
    if (uSelectionBias < -0.01) {
      float biasAmount = -uSelectionBias;
      
      if (abs(aEntityType - 1.0) < 0.1) {
        // Fracture / Open effect
        float fractureNoise = snoise(pos * 1.5 + vec3(0.0, 0.0, t * 0.5));
        float fractureMask = smoothstep(0.2, 0.8, fractureNoise + biasAmount * 0.5);
        pos += normal * (fractureNoise * biasAmount * fieldInfluence * 2.5);
      } else if (abs(aEntityType) < 0.1) {
        float visualWave = sin(pos.y * 0.38 + t * 0.45) * cos(pos.x * 0.22 - t * 0.25) * 1.8;
        float visualBreath = sin(t * 0.75 + pos.z * 0.25) * 0.8;
        pos.xy += vec2(-0.9, visualWave * 0.7 + visualBreath * 0.5) * biasAmount * fieldInfluence;
        pos.z += (visualWave + visualBreath) * 0.85 * biasAmount * fieldInfluence;
      }
    }

    // TECHNICAL ATTRACTOR (Lower-Right Bias, uSelectionBias > 0):
    // Tension, alignment, precise planar crystallization
    if (uSelectionBias > 0.01) {
      float biasAmount = uSelectionBias;
      
      if (abs(aEntityType - 2.0) < 0.1) {
        // Resolve / Segment effect
        float layerStep = floor(pos.y * 2.5) / 2.5;
        float layerTension = (layerStep - pos.y) * 0.5;
        pos.xz *= 1.0 - (layerTension * biasAmount * fieldInfluence);
        pos.y += layerTension * biasAmount * fieldInfluence * 0.8;
      } else if (abs(aEntityType) < 0.1) {
        // Quantized planar facet steps along structured diagonal axis
        float facetStep = floor((pos.y * 1.6 + pos.x * 0.8 + pos.z * 0.5) * 1.8) / 1.8;
        float techTension = (facetStep - (pos.y + pos.x * 0.5)) * 0.85;
        pos.xy += vec2(0.9 + techTension * 0.35, techTension * 0.9) * biasAmount * fieldInfluence;
        pos.z += sin(pos.x * 1.4 + pos.y * 0.8) * 0.65 * biasAmount * fieldInfluence;
      }
    }
  }

  // Multi-Phase Material Mapping
  float phaseVal = clamp(
    0.5 + 0.35 * fold + 0.2 * microNoise + (pos.x * 0.08) - (pos.z * 0.04),
    0.0,
    1.0
  );
  vMaterialPhase = phaseVal;
  vShearField = fold;
  vDisplacement = fold * 0.7 + microNoise * 0.3 + pointerTension * 0.5;

  pos += normal * (vDisplacement * 0.45);

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vDepthMetric = -worldPos.z;

  vec4 mvPos = viewMatrix * worldPos;
  vViewPosition = -mvPos.xyz;

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
uniform float uInstability;
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
varying float vTensionSeam;
varying float vSingularityDistance;
varying float vDepthMetric;
varying float vEntityType;

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

  // Directional lighting
  vec3 lightDir1 = normalize(vec3(0.35, 0.85, 0.55));
  vec3 lightDir2 = normalize(vec3(-0.7, -0.25, 0.65));
  
  float NdotL1 = max(dot(N, lightDir1), 0.0);
  float NdotL2 = max(dot(N, lightDir2), 0.0);

  // Subsurface Scattering & Anisotropic Sheen
  vec3 sssLight = normalize(lightDir1 + N * 0.35);
  float sssDot = max(0.0, dot(V, -sssLight));
  float sss = pow(sssDot, 3.2) * 0.6;
  vec3 sssColor = vec3(0.99, 0.96, 0.92) * sss;

  vec3 H = normalize(lightDir1 + V);
  float NdotH = max(dot(N, H), 0.0);
  float anisoSpec = pow(NdotH, 32.0) * (0.85 + 0.35 * sin(vShearField * 5.0));
  vec3 sheen = mineralSheen(NdotV, vShearField, vMaterialPhase) * anisoSpec;

  // Refraction dispersion
  vec3 refractR = refract(-V, N, 0.91);
  vec3 refractG = refract(-V, N, 0.89);
  vec3 refractB = refract(-V, N, 0.87);

  float dispersionFringe = length(refractR - refractB) * 0.9;
  vec3 chromaticColor = vec3(
    dot(refractR, vec3(0.35, 0.45, 0.2)),
    dot(refractG, vec3(0.2, 0.6, 0.2)),
    dot(refractB, vec3(0.2, 0.35, 0.45))
  ) * 0.15;

  vec3 alabaster = uColorBase;
  vec3 pearl = uColorPearl;
  vec3 graphite = uColorGraphite;

  vec3 matterColor = mix(alabaster, pearl, smoothstep(0.2, 0.7, vMaterialPhase));
  matterColor += sheen * 0.9;
  matterColor += sssColor * (1.0 - smoothstep(0.6, 0.9, vMaterialPhase));
  matterColor += uColorRefract * dispersionFringe;
  matterColor += chromaticColor;
  matterColor += fresnel * vec3(0.98, 0.98, 0.95) * 0.55;

  // Tension Seam refractive perturbation (The seam between the two behaviors)
  if (vTensionSeam > 0.01) {
    matterColor += vec3(0.04, 0.05, 0.06) * vTensionSeam * fresnel;
    matterColor += chromaticColor * vTensionSeam * 1.5;
  }

  // Instability event flash of non-Euclidean optical dispersion
  if (uInstability > 0.01) {
    matterColor = mix(matterColor, vec3(0.99, 0.98, 0.95) + chromaticColor * 2.0, uInstability * 0.35);
  }

  // Cavity Occlusion & Event Darkness
  float creviceOcc = smoothstep(-0.6, -0.05, vDisplacement) * (1.0 - smoothstep(0.0, 0.75, NdotV));
  matterColor = mix(matterColor, graphite, creviceOcc * 0.45);

  float totalDarkness = max(uEventDarkness, vInversionWeight * 0.45);
  matterColor = mix(matterColor, graphite * 1.7 + vec3(0.04), totalDarkness * 0.88);

  // Attractor Color Temperature Nuances:
  // Visuals: Warm ivory/pearl luminescence
  // Technical: Crisp steel-mineral clarity
  // Attractor Specific Behaviors
  if (uProgress > 0.8) {
    float endFade = smoothstep(0.8, 0.95, uProgress);
    if (abs(vEntityType) < 0.1) {
      // Fade out the chaotic environment field slightly so the distinct entities stand out
      alpha *= mix(1.0, 0.15, endFade);
    }
  }

  if (uProgress > 0.85) {
    if (uSelectionBias < -0.01) {
      vec3 warmBias = vec3(0.98, 0.95, 0.91) + sssColor * 0.5;
      matterColor = mix(matterColor, warmBias, (-uSelectionBias) * 0.42);
    } else if (uSelectionBias > 0.01) {
      vec3 coolBias = vec3(0.91, 0.93, 0.95) + sheen * 0.6;
      matterColor = mix(matterColor, coolBias, uSelectionBias * 0.42);
    }
  }

  // Transparency & Hero Field Presence (Continuous living matter across center)
  float dormantAlpha = smoothstep(0.0, 0.16, uProgress);
  float dormantBase = mix(0.08 + 0.35 * fresnel, 1.0, dormantAlpha);

  float phaseAlpha = mix(0.4, 0.95, vMaterialPhase);
  float alpha = clamp(
    dormantBase * phaseAlpha * (0.4 + 0.6 * fresnel + 0.4 * anisoSpec),
    0.0,
    1.0
  );

  if (uProgress > 0.85) {
    if (abs(vEntityType - 1.0) < 0.1 && uSelectionBias < -0.01) {
      float biasAmount = -uSelectionBias;
      float fracture = sin(vWorldPosition.x * 4.0 + uTime * 0.5) * cos(vWorldPosition.y * 4.0 - uTime * 0.3) * sin(vWorldPosition.z * 4.0);
      if (fracture < (biasAmount * 1.2 - 0.6)) {
        alpha = 0.0;
      } else {
        matterColor = mix(matterColor, vec3(0.95, 0.85, 0.75) + chromaticColor * 4.0 + sssColor * 2.0, biasAmount);
        alpha = mix(alpha, 1.0, biasAmount);
      }
    } else if (abs(vEntityType - 2.0) < 0.1 && uSelectionBias > 0.01) {
      float biasAmount = uSelectionBias;
      // Precise metallic striations
      float striation = smoothstep(0.85, 0.95, sin(vWorldPosition.y * 15.0));
      matterColor = mix(matterColor, vec3(0.98, 0.99, 1.0), striation * biasAmount * 0.6);
      alpha = mix(alpha, 1.0, striation * biasAmount);
    }
  }

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
