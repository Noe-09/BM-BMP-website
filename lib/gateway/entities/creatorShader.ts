export const creatorVertexShader = /* glsl */ `
uniform float uTime;
uniform float uReveal;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vObjectPosition;

void main() {
  vObjectPosition = position;
  float breath = sin(position.y * 2.4 + uTime * 0.28) * 0.018 * uReveal;
  vec3 shaped = position + normal * breath;
  vec4 mvPosition = modelViewMatrix * vec4(shaped, 1.0);
  vViewPosition = -mvPosition.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const creatorFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uSelected;
uniform float uKind;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vObjectPosition;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float facing = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - facing, 2.6);
  vec3 lightDirection = normalize(vec3(-0.35, 0.75, 0.55));
  float diffuse = smoothstep(-0.2, 0.9, dot(N, lightDirection));

  vec3 graphite = mix(vec3(0.075, 0.095, 0.12), vec3(0.30, 0.34, 0.38), diffuse);
  vec3 pearl = mix(vec3(0.52, 0.56, 0.61), vec3(0.88, 0.85, 0.91), diffuse);
  vec3 spectral = mix(
    vec3(0.33, 0.72, 0.78),
    vec3(0.70, 0.48, 0.78),
    sin(vObjectPosition.y * 2.1 + uTime * 0.18) * 0.5 + 0.5
  );

  vec3 surface = uKind < 0.5
    ? graphite
    : uKind < 1.5
      ? mix(pearl, spectral, fresnel * (0.24 + uReveal * 0.34))
      : spectral * (0.72 + uSelected * 0.35);
  surface += spectral * fresnel * (0.10 + uReveal * 0.22);
  gl_FragColor = vec4(surface, 1.0);
}
`;
