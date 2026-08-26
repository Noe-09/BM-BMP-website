import {
  DirectionalLight,
  Group,
  PointLight,
  Vector2,
} from "three";
import { TechnicalEntity } from "./technicalEntity";
import { VisualsEntity, type EntityUpdateParams } from "./visualsEntity";

export type DualEntitySystemParams = {
  progress: number;
  selectionBias: number;
  reducedMotion: boolean;
  eventDarkness: number;
};

export class DualEntitySystem {
  readonly group: Group;

  readonly visuals: VisualsEntity;
  readonly technical: TechnicalEntity;

  private keyLight: DirectionalLight;
  private fillLight: PointLight;

  private pointerTarget = new Vector2(0, 0);
  private pointerCurrent = new Vector2(0, 0);

  constructor() {
    this.group = new Group();
    this.group.name = "DualEntitySystem";

    this.visuals = new VisualsEntity();
    this.group.add(this.visuals.group);

    this.technical = new TechnicalEntity();
    this.group.add(this.technical.group);

    // Dedicated key and fill illumination in the final entity depth corridor (Z ~ -26)
    this.keyLight = new DirectionalLight(0xfffefc, 1.5);
    this.keyLight.position.set(-3, 6, -20);
    this.group.add(this.keyLight);

    this.fillLight = new PointLight(0xefeae1, 1.2, 22, 1.5);
    this.fillLight.position.set(3, 2, -22);
    this.group.add(this.fillLight);
  }

  setPointer(x: number, y: number) {
    this.pointerTarget.set(x, y);
  }

  tick(deltaSeconds: number, params: DualEntitySystemParams, totalTime: number) {
    const pointerDamp = params.reducedMotion ? 12 : 3.0;
    this.pointerCurrent.x +=
      (this.pointerTarget.x - this.pointerCurrent.x) *
      Math.min(1, deltaSeconds * pointerDamp);
    this.pointerCurrent.y +=
      (this.pointerTarget.y - this.pointerCurrent.y) *
      Math.min(1, deltaSeconds * pointerDamp);

    const updateParams: EntityUpdateParams = {
      progress: params.progress,
      selectionBias: params.selectionBias,
      pointerX: this.pointerCurrent.x,
      pointerY: this.pointerCurrent.y,
      reducedMotion: params.reducedMotion,
    };

    this.visuals.tick(deltaSeconds, updateParams, totalTime);
    this.technical.tick(deltaSeconds, updateParams, totalTime);

    // Subtle overall parallax responding to pointer
    if (!params.reducedMotion) {
      this.group.position.x = this.pointerCurrent.x * 0.4;
      this.group.position.y = this.pointerCurrent.y * 0.25;
    }

    // Light modulation during darkness / transitions
    const darknessFactor = 1.0 - params.eventDarkness * 0.85;
    this.keyLight.intensity = 1.5 * darknessFactor;
    this.fillLight.intensity = 1.2 * darknessFactor;
  }

  dispose() {
    this.visuals.dispose();
    this.technical.dispose();
    this.group.clear();
  }
}
