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
uniform vec3 uFogColor;
uniform float uSpectral;
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
  vec3 opal = mix(vec3(.57, .84, .84), vec3(.78, .68, .90), interference);
  opal = mix(opal, vec3(1., .73, .60), broad * .35);
  float interior = 1. - smoothstep(.04, .48, vUv.y);
  float shelter = (.5 + .5 * sin(vUv.x * 7. + uSeed)) * interior;
  vec3 color = uColor * (.22 + key * .68 + bounce * .15);
  color = mix(color, uAccent * (.18 + key * .48), interior * .52 + (1. - key) * .15 + lamina * .018);
  color *= 1. - shelter * .30;
  float mineral = .5 + .5 * sin(vLocal.z * 3.2 + sin(vLocal.y * .7 + vLocal.x * .4) * 2.);
  color = mix(color, color * uAccent * 1.4, mineral * interior * .10);
  color += opal * interior * uSpectral * .10;
  // An analytic studio light field gives the mineral surface reflected volume.
  // These broad reflected windows bend with the world; no screen-space stripes.
  vec3 R = reflect(-V, N);
  float window = exp(-pow((R.y - .48 + .18 * R.x) * 3., 2.));
  float coolWindow = exp(-pow((R.x + .48 - R.z * .32) * 7., 2.));
  float occludedSky = exp(-pow((R.y + .22 + .2 * R.x) * 3., 2.));
  color *= 1. - occludedSky * (.16 + interior * .18);
  color += vec3(.93, .98, 1.) * window * (.10 + edge * .20);
  color += uAccent * coolWindow * (.22 + uSpectral * .22);
  color += opal * edge * (.10 + uSpectral * .16);
  color += mix(opal, vec3(1.), .6) * specular * .62;
  color = mix(color, color * vec3(.55, .64, .73), uDarkness * .52);
  color += uAccent * pow(edge, 2.) * uSpectral * .18;
  if (uOptical > .5) {
    vec2 screenUv = gl_FragCoord.xy / uResolution;
    vec2 offset = N.xy * (.013 + edge * .012);
    vec3 transmitted;
    transmitted.r = texture2D(uBackground, clamp(screenUv + offset * 1.05, .002, .998)).r;
    transmitted.g = texture2D(uBackground, clamp(screenUv + offset, .002, .998)).g;
    transmitted.b = texture2D(uBackground, clamp(screenUv + offset * .95, .002, .998)).b;
    color = mix(transmitted * .95, color + opal * edge * .25, .10 + edge * .52);
  }
  float distanceToCamera = length(cameraPosition - vWorld);
  float fog = 1. - exp(-distanceToCamera * (.006 + uFar * .006));
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
      uFogColor: { value: new Color(0xeaf0f1) },
      uSeed: { value: seed },
      uSpectral: { value: .2 }, uDarkness: { value: 0 }, uOpacity: { value: 1 },
      uOptical: { value: optical ? 1 : 0 }, uFar: { value: far ? 1 : 0 },
      uBackground: { value: null }, uResolution: { value: new Vector2(1, 1) },
    },
  });
}
