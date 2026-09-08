import { Color, DoubleSide, ShaderMaterial, Vector2 } from "three";

const vertexShader = /* glsl */ `
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vLocal;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  vLocal = p;
  vec4 world = modelMatrix * vec4(p, 1.);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec3 uPearl;
uniform vec3 uCool;
uniform vec3 uViolet;
uniform vec3 uWarm;
uniform vec3 uShadow;
uniform vec3 uFogColor;
uniform float uSpectral;
uniform float uOpticalEnergy;
uniform float uDestination;
uniform float uExposure;
uniform float uHaze;
uniform float uGlow;
uniform float uDarkness;
uniform float uOpacity;
uniform float uOptical;
uniform float uSeed;
uniform float uFar;
uniform sampler2D uBackground;
uniform vec2 uResolution;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vLocal;
varying vec2 vUv;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorld);
  if (dot(N, V) < 0.) N = -N;
  float facing = max(dot(N, V), 0.);
  float edge = pow(1. - facing, 2.8);
  vec3 L = normalize(vec3(-.45, .55, .9));
  float key = max(dot(N, L), 0.);
  float bounce = max(dot(N, normalize(vec3(.6, -.25, .4))), 0.);
  float specular = pow(max(dot(N, normalize(L + V)), 0.), 100.);
  float broad = pow(max(dot(N, normalize(L + V)), 0.), 7.);
  // Luminous lamination follows the folded surface. No image noise or RGB cycling.
  float band = vUv.y * 26. + sin(vUv.x * 7. + uSeed) * 1.8;
  float lamina = .5 + .5 * sin(band * 6.2831853);
  float filterWidth = fwidth(band) * 6.;
  lamina = mix(lamina, .5, clamp(filterWidth, 0., 1.));
  float interference = .5 + .5 * sin(facing * 8. + vUv.y * 4. + uSeed);
  float distanceToCamera = length(cameraPosition - vWorld);
  float midground = 1. - smoothstep(12., 38., distanceToCamera);
  float spectralGain = (mix(.48, 1., midground) + uOptical * .20) * (.82 + uOpticalEnergy * .28);
  vec3 opal = mix(uCool, uViolet, smoothstep(.20, .88, interference));
  float interior = 1. - smoothstep(.04, .48, vUv.y);
  float shelter = (.5 + .5 * sin(vUv.x * 7. + uSeed)) * interior;
  vec3 accent = mix(uAccent, uCool, .65 * spectralGain);
  vec3 color = mix(uColor, uPearl, .16) * (.22 + key * .68 + bounce * .15);
  color = mix(color, accent * (.18 + key * .48), interior * .52 + (1. - key) * .15 + lamina * .018);
  color *= 1. - shelter * .30;
  float mineral = .5 + .5 * sin(vLocal.z * 3.2 + sin(vLocal.y * .7 + vLocal.x * .4) * 2.);
  color = mix(color, color * uAccent * 1.4, mineral * interior * .10);
  color += opal * interior * uSpectral * .18 * spectralGain;
  // An analytic studio light field gives the mineral surface reflected volume.
  // These broad reflected windows bend with the world; no screen-space stripes.
  vec3 R = reflect(-V, N);
  float window = exp(-pow((R.y - .48 + .18 * R.x) * 3., 2.));
  float coolWindow = exp(-pow((R.x + .48 - R.z * .32) * 7., 2.));
  float occludedSky = exp(-pow((R.y + .22 + .2 * R.x) * 3., 2.));
  color *= 1. - occludedSky * (.16 + interior * .18 + uDarkness * .55);
  // Interference replaces part of a reflection instead of additive whitening.
  float spectralReflection = (coolWindow * .42 + edge * .32) * uSpectral * spectralGain;
  color = mix(color, opal * (.32 + key * .46), spectralReflection);
  color += uPearl * window * (.10 + edge * .20);
  color += accent * coolWindow * (.22 + uSpectral * .28) * spectralGain;
  color += opal * edge * (.10 + uSpectral * .24) * spectralGain;
  // A small warm reflected aperture, attached to surface direction, not screen UV.
  float warmWindow = exp(-pow((R.x - .38 + R.z * .24) * 9., 2.));
  color = mix(color, color * uShadow * 2., uDarkness * (1.05 + occludedSky * .45));
  color = mix(color, uWarm * (.30 + broad * .45), warmWindow * (.08 + edge * .32) * uSpectral * spectralGain);
  // Pearl response sits above shadow grading to keep the core's edges precise.
  color += mix(opal, uPearl, .78) * specular * .66;
  color += opal * pow(edge, 2.) * uSpectral * .18 * spectralGain;
  float destinationRim = pow(edge, 3.6) * (.45 + .55 * sin(vUv.y * 9. + uSeed) * sin(vUv.y * 9. + uSeed));
  color += mix(uCool, uPearl, .74) * destinationRim * uDestination * .52;
  color += mix(uViolet, uPearl, .62) * pow(edge, 4.) * uGlow * .075;
  if (uOptical > .5) {
    vec2 screenUv = gl_FragCoord.xy / uResolution;
    vec2 offset = N.xy * (.013 + edge * .012) * (1. + uOpticalEnergy * .22);
    vec3 transmitted;
    transmitted.r = texture2D(uBackground, clamp(screenUv + offset * 1.05, .002, .998)).r;
    transmitted.g = texture2D(uBackground, clamp(screenUv + offset, .002, .998)).g;
    transmitted.b = texture2D(uBackground, clamp(screenUv + offset * .95, .002, .998)).b;
    color = mix(transmitted * .95, color + opal * edge * .25, .10 + edge * .52);
  }
  color *= mix(.92, 1.08, uExposure);
  color = color / (1. + max(max(color.r, color.g), color.b) * .075);
  color = mix(color, color * uShadow * 1.8, uHaze * uFar * .26);
  float fog = 1. - exp(-distanceToCamera * (.0055 + uFar * .005 + uHaze * .0015));
  color = mix(color, uFogColor, clamp(fog, 0., .94));
  gl_FragColor = vec4(color, uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export function createSpectralMaterial(color: number, accent: number, seed: number, optical = false, far = false) {
  return new ShaderMaterial({
    vertexShader, fragmentShader, side: DoubleSide,
    transparent: optical, depthWrite: !optical,
    uniforms: {
      uColor: { value: new Color(color) }, uAccent: { value: new Color(accent) },
      uPearl: { value: new Color() }, uCool: { value: new Color() },
      uViolet: { value: new Color() }, uWarm: { value: new Color() }, uShadow: { value: new Color() },
      uFogColor: { value: new Color(0xeaf0f1) },
      uSeed: { value: seed },
      uSpectral: { value: .2 }, uOpticalEnergy: { value: 0 }, uDestination: { value: 0 },
      uExposure: { value: .9 }, uHaze: { value: 0 }, uGlow: { value: 0 },
      uDarkness: { value: 0 }, uOpacity: { value: 1 },
      uOptical: { value: optical ? 1 : 0 }, uFar: { value: far ? 1 : 0 },
      uBackground: { value: null }, uResolution: { value: new Vector2(1, 1) },
    },
  });
}
