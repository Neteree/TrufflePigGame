import {
  _decorator,
  AudioClip,
  AudioSource,
  CCInteger,
  Collider2D,
  Component,
  Contact2DType,
  EventKeyboard,
  input,
  Input,
  IPhysics2DContact,
  KeyCode,
  Label,
  RigidBody2D,
  Vec2,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Pig")
export class NewComponent extends Component {
  @property({
    type: Label,
  })
  public scoreLabel: Label;

  @property({
    type: Label,
  })
  public winLabel: Label;

  @property({
    type: CCInteger,
  })
  public speed: number;

  public score = 0;
  public rigidBody2d: RigidBody2D;
  public audioSource: AudioSource;

  @property({
    type: [AudioClip],
  })
  public audioClips: AudioClip[] = [];

  start() {
    let collider = this.getComponent(Collider2D);

    collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  onLoad() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    this.rigidBody2d = this.node.getComponent(RigidBody2D);
    this.audioSource = this.node.getComponent(AudioSource);
  }

  onDestroy() {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    if (otherCollider.node.name.includes("Truffle")) {
      this.score++;
      this.scoreLabel.string = `Score: ${this.score}`;
      otherCollider.node.destroy();
      this.audioSource.playOneShot(this.audioClips[0]);

      if (this.score === 5) {
        this.winLabel.node.active = true;
        this.audioSource.playOneShot(this.audioClips[1]);
      }
    }
  }

  onKeyDown(event: EventKeyboard) {
    if (this.rigidBody2d.linearVelocity.equals(new Vec2(0, 0))) {
      switch (event.keyCode) {
        case KeyCode.KEY_A:
          this.node.angle += 90;
          break;
        case KeyCode.KEY_D:
          this.node.angle -= 90;
          break;
        case KeyCode.SPACE:
          this.rigidBody2d.linearVelocity =
            Math.abs(this.node.up.x) === 1
              ? new Vec2(-this.node.up.x * this.speed, 0)
              : new Vec2(0, -this.node.up.y * this.speed);
          break;
      }
    }
  }
}
