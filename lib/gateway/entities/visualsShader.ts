export const visualsVertexShader = /* glsl */ `
uniform float uTime;
uniform float uHover;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;
varying vec2 vUv;
varying float vDisplacement;

void main() {
  vUv = uv;
  vObjectPosition = position;

  // Subtle organic harmonic breathing across the creative worldform
  float wave = sin(position.x * 2.2 + position.y * 1.8 + uTime * 0.4) *
               cos(position.z * 2.0 + position.x * 1.4 - uTime * 0.3);
  
  float hoverWave = sin(position.y * 3.2 + uTime * 0.6) * 0.035 * uHover;
  float totalDisp = wave * (0.03 + uHover * 0.02) + hoverWave;
  vDisplacement = totalDisp;

  vec3 displacedPos = position + normal * totalDisp;

  vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
  vWorldPosition = worldPos.xyz;

  vec4 mvPos = viewMatrix * worldPos;
  vViewPosition = -mvPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * mvPos;
}
`;

export const visualsFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform float uProgress;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;
varying vec2 vUv;
varying float vDisplacement;

// Cosine-based smooth spectral palette for interference pearl
vec3 pearlPalette(float t) {
  vec3 a = vec3(0.86, 0.84, 0.82);
  vec3 b = vec3(0.12, 0.14, 0.16);
  vec3 c = vec3(1.0, 0.9, 0.8);
  vec3 d = vec3(0.15, 0.45, 0.75);
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
  float fresnel = pow(1.0 - NdotV, 2.8);

  // Directional lighting
  vec3 lightDir = normalize(vec3(-0.4, 0.7, 0.6));
  vec3 H = normalize(lightDir + V);
  float NdotL = max(dot(N, lightDir), 0.0);
  float NdotH = max(dot(N, H), 0.0);

  if (isFront) {
    // 1. SCULPTURAL MINERAL ALABASTER BASE
    vec3 baseAlabaster = vec3(0.88, 0.86, 0.83);
    vec3 ambientShadow = vec3(0.48, 0.46, 0.44);
    float wrapLight = smoothstep(-0.25, 0.75, dot(N, lightDir));
    vec3 diffuse = mix(ambientShadow, baseAlabaster, wrapLight);

    // 2. PRISMATIC THIN-FILM INTERFERENCE
    float spectralCoord = (1.0 - NdotV) * 1.1 + vDisplacement * 3.5 + sin(vObjectPosition.y * 1.2 + uTime * 0.15) * 0.15;
    vec3 iridescence = pearlPalette(spectralCoord);

    // 3. INNER NEBULA EMERGENCE
    vec3 innerCoord = vObjectPosition * 0.5 + vec3(sin(uTime * 0.12) * 0.15, uTime * 0.05, cos(uTime * 0.1) * 0.15);
    float nebulaWave = sin(innerCoord.x * 2.5 + innerCoord.y * 2.0) * cos(innerCoord.z * 2.2 - innerCoord.x * 1.5);
    
    vec3 lavender = vec3(0.84, 0.78, 0.92);
    vec3 coralRose = vec3(0.96, 0.74, 0.66);
    vec3 subtleCyan = vec3(0.68, 0.88, 0.90);

    vec3 innerColor = mix(lavender, coralRose, sin(nebulaWave * 2.2 + uTime * 0.35) * 0.5 + 0.5);
    innerColor = mix(innerColor, subtleCyan, smoothstep(0.2, 0.7, fresnel) * 0.5);
    float coreGlow = (1.0 - pow(NdotV, 1.4)) * (0.38 + uHover * 0.35);

    // 4. SUBSURFACE SCATTERING
    vec3 sssLight = normalize(lightDir + N * 0.35);
    float sssDot = max(0.0, dot(V, -sssLight));
    float sss = pow(sssDot, 3.2) * (0.32 + uHover * 0.22);
    vec3 sssColor = vec3(0.98, 0.90, 0.82) * sss;

    // 5. SPECULAR & RIM
    float specSharp = pow(NdotH, 42.0) * 0.65;
    float specBroad = pow(NdotH, 10.0) * 0.22;
    vec3 specColor = vec3(1.0, 0.99, 0.96) * (specSharp + specBroad);

    vec3 finalColor = diffuse;
    finalColor = mix(finalColor, iridescence, 0.55 + uHover * 0.25);
    finalColor += innerColor * coreGlow;
    finalColor += sssColor;
    finalColor += specColor;
    finalColor += fresnel * vec3(0.95, 0.93, 0.97) * (0.35 + uHover * 0.25);

    gl_FragColor = vec4(finalColor, 1.0);
  } else {
    // INNER SHELL CAVITY: Glowing cosmic lavender / warm coral lining exposed upon opening
    vec3 cavityLavender = vec3(0.82, 0.75, 0.94);
    vec3 cavityCoral = vec3(0.98, 0.72, 0.64);
    vec3 cavityTone = mix(cavityLavender, cavityCoral, sin(vObjectPosition.y * 3.0 + uTime * 0.4) * 0.5 + 0.5);
    cavityTone += vec3(0.12, 0.15, 0.18) * (1.0 - NdotV);

    gl_FragColor = vec4(cavityTone * 1.15, 1.0);
  }
}
`;

export const previewFragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform float uHover;
uniform float uTime;
uniform vec3 uTint;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float NdotV = max(dot(N, V), 0.0);

  // Soft elliptical mask to dissolve sharp rectangular borders
  vec2 centerDist = vUv - vec2(0.5);
  float radius = length(centerDist * vec2(1.0, 1.35));
  float vignette = smoothstep(0.48, 0.22, radius);

  // Subtle prismatic refraction drift
  vec2 uvDistort = vUv + vec2(sin(vUv.y * 6.0 + uTime * 0.4) * 0.012, cos(vUv.x * 5.0 + uTime * 0.3) * 0.012) * uHover;
  vec4 texColor = texture2D(uTexture, uvDistort);

  // Ethereal chromatic fringe along the periphery
  float rim = pow(1.0 - NdotV, 2.5);
  vec3 chromaticRim = vec3(0.85, 0.90, 0.98) * rim * 0.5;

  // Grade color towards dreamy editorial atmosphere
  vec3 gradedColor = mix(texColor.rgb, uTint, 0.22);
  gradedColor += chromaticRim;
  gradedColor += vec3(0.08, 0.06, 0.10) * uHover;

  float alpha = vignette * smoothstep(0.05, 0.75, uHover) * 0.92;

  if (alpha < 0.01) discard;

  gl_FragColor = vec4(gradedColor, alpha);
}
`;

export const previewVertexShader = /* glsl */ `
uniform float uTime;
uniform float uHover;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;

  // Subtle curvature flex responding to hover
  vec3 pos = position;
  float curve = sin(uv.x * 3.14159) * cos(uv.y * 3.14159) * 0.12 * uHover;
  pos.z += curve;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vec4 mvPos = viewMatrix * worldPos;
  vViewPosition = -mvPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * mvPos;
}
`;
