# threlte <!-- omit in toc -->

A three.js component library for svelte.

## Index <!-- omit in toc -->

- [What is threlte?](#what-is-threlte)
- [Getting started](#getting-started)
- [Reference](#reference)
  - [Types](#types)
  - [Canvas](#canvas)
      - [Properties](#properties)
      - [Bindings](#bindings)
  - [Objects](#objects)
    - [Mesh](#mesh)
      - [Properties](#properties-1)
      - [Bindings](#bindings-1)
    - [Group](#group)
      - [Properties](#properties-2)
      - [Bindings](#bindings-2)
    - [Object3D](#object3d)
      - [Properties](#properties-3)
      - [Bindings](#bindings-3)
  - [Misc](#misc)
    - [Fog](#fog)
      - [Properties](#properties-4)
      - [Bindings](#bindings-4)
    - [FogExp2](#fogexp2)
      - [Properties](#properties-5)
      - [Bindings](#bindings-5)
    - [Text](#text)
    - [Layer](#layer)
  - [Lights](#lights)
    - [AmbientLight](#ambientlight)
    - [DirectionalLight](#directionallight)
    - [HemisphereLight](#hemispherelight)
    - [PointLight](#pointlight)
    - [SpotLight](#spotlight)
  - [Cameras](#cameras)
    - [OrthographicCamera](#orthographiccamera)
    - [PerspectiveCamera](#perspectivecamera)
  - [Controls](#controls)
    - [OrbitControls](#orbitcontrols)
  - [Effects](#effects)
    - [Pass](#pass)
  - [hooks](#hooks)
    - [useThrelte](#usethrelte)
    - [useThrelteRoot](#usethrelteroot)
    - [useFrame](#useframe)
    - [useTexture](#usetexture)
- [Concepts](#concepts)
  - [Interactivity](#interactivity)
  - [Viewport Awareness](#viewport-awareness)
  - [Reactivity](#reactivity)
- [Credits](#credits)
- [License](#license)

## What is threlte?

`threlte` is a component library for svelte to build and render three.js scenes declaratively and state-driven in Svelte apps.

It's inspired by the sensible defaults of [react-three-fiber](https://github.com/pmndrs/react-three-fiber), the simplicity and effectiveness of Sveltes reactivity model and [svelte-cubed](https://github.com/Rich-Harris/svelte-cubed).

It provides strictly typed components to quickly and easily build three.js scenes with deep reactivity and interactivity out-of-the-box.

## Getting started

Install threlte and three.js:

```bash
npm install threlte three
```

For TypeScript users, install three.js types:

```bash
npm install -D @types/three
```

Build your first scene:

[Open in CodeSandbox](https://codesandbox.io/s/threlte-getting-started-vjlk4?file=/App.svelte)

```svelte
<script>
  import { CircleBufferGeometry, MeshStandardMaterial, SphereBufferGeometry } from 'three'
  import {
    Canvas,
    DirectionalLight,
    HemisphereLight,
    Mesh,
    OrbitControls,
    PerspectiveCamera
  } from 'threlte'
</script>

<div>
  <Canvas>
    <PerspectiveCamera position={{ x: 10, y: 10, z: 10 }}>
      <OrbitControls enableDamping />
    </PerspectiveCamera>

    <DirectionalLight shadow color={'#EDBD9C'} position={{ x: -15, y: 45, z: 20 }} />

    <HemisphereLight skyColor={0x4c8eac} groundColor={0xac844c} intensity={0.6} />

    <Mesh
      castShadow
      geometry={new SphereBufferGeometry(1, 40, 40)}
      material={new MeshStandardMaterial({ color: '#dddddd' })}
    />

    <Mesh
      receiveShadow
      position={{ y: -1.5 }}
      rotation={{ x: -90 * (Math.PI / 180) }}
      geometry={new CircleBufferGeometry(3, 72)}
      material={new MeshStandardMaterial({ color: 'white' })}
    />
  </Canvas>
</div>

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
```

## Reference

### Types

To make working with component props easier, threlte includes special types for position, scale and rotation:

```ts
type Position = 
  | Vector3 
  |  { 
      x?: number
      y?: number
      z?: number
    }

// Examples
const positionA = new Vector3()
const positionB = { x: 0, z: 0 }

type Scale =
  | Vector3
  | number
  | {
      x?: number
      y?: number
      z?: number
    }

// Examples
const scaleA = new Vector3()
const scaleB = 2
const scaleC = { x: 1.5, z: 1 }

type Rotation =
  | Euler
  | {
      x?: number
      y?: number
      z?: number
      order?: Euler['order']
    }

// Examples
const rotationA = new Euler()
const rotationB = { x: 1.5, z: 1 }
```

The `<Canvas>` component provides two very useful contexts: `ThrelteContext` and `ThrelteRootContext`

```ts
type ThrelteContext = {
  /**
   * Size of the canvas element
   */
  size: { width: number; height: number }
  /**
   * Contains updated, normalized, centric pointer coordinates, useful for raycasting
   */
  pointer?: Vector2
  /**
   * Central THREE.Clock
   */ 
  clock: Clock
  /**
   * The camera that is currently in use
   */ 
  camera?: Camera
  /**
   * The scene that is currently being rendered
   */ 
  scene: Scene
  /**
   * The renderer that is rendering the scene
   */ 
  renderer?: WebGLRenderer
  /**
   * Call render to trigger a rerender on the next frame if frameloop is set to "demand" (default)
   */
  render: (requestedBy?: string) => void
}
  
type ThrelteRootContext = {
  setCamera: (camera: Camera) => void
  addRaycastableObject: (obj: Object3D) => void
  removeRaycastableObject: (obj: Object3D) => void
  addInteractiveObject: (obj: Object3D) => void
  removeInteractiveObject: (obj: Object3D) => void
  addPass: (pass: Pass) => void
  removePass: (pass: Pass) => void
  linear: boolean
  interactiveObjects: Set<Object3D>
  raycastableObjects: Set<Object3D>
  composer?: EffectComposer
  resizeOpts?: UseResizeOptions
}
```

Use them like this in any component that is a child of `<Canvas>`:

```ts
const ctx = useThrelte()
const rootCtx = useThrelteRoot()
```

### Canvas

The `<Canvas>` component is the root of your three.js scene. It's responsible for managing the frame loop as well as providing the three.js `Scene`.

##### Properties

```ts
dpr: typeof devicePixelRatio = browser ? window.devicePixelRatio : 1
flat: boolean = false
linear: boolean = false
frameloop: 'always' | 'demand' = 'demand'
debugFrameloop: boolean = false
shadows: boolean = true
shadowMapType: ShadowMapType = PCFSoftShadowMap
resizeOpts: UseResizeOptions | undefined = undefined
```

##### Bindings

```ts
ctx: ThrelteContext
rootCtx: ThrelteRootContext
```

### Objects

#### Mesh

##### Properties

```ts
geometry: THREE.BufferGeometry
material: THREE.Material | THREE.Material[] = defaults.mesh.material()

position: Position = defaults.position
scale: Scale = defaults.scale
rotation: Rotation = defaults.rotation
viewportAware: boolean = false
castShadow: boolean = defaults.mesh.castShadow
receiveShadow: boolean = defaults.mesh.receiveShadow
frustumCulled: boolean = defaults.mesh.frustumCulled
renderOrder: number = defaults.mesh.renderOrder
interactive: boolean = false
ignorePointerEvents: boolean = false
lookAt: LookAtProp | undefined = undefined
```

##### Bindings

```ts
inViewport: boolean
mesh: THREE.Mesh
```

#### Group

##### Properties

```ts
position: Position = defaults.position
scale: Scale = defaults.scale
rotation: Rotation = defaults.rotation
viewportAware: boolean = false
frustumCulled = defaults.mesh.frustumCulled
renderOrder = defaults.mesh.renderOrder
lookAt: LookAt | undefined = undefined
```

##### Bindings

```ts
inViewport: boolean
group: THREE.Group
```

#### Object3D

##### Properties

```ts
position: Position = defaults.position
scale: Scale = defaults.scale
rotation: Rotation = defaults.rotation
viewportAware: boolean = false
frustumCulled = defaults.mesh.frustumCulled
renderOrder = defaults.mesh.renderOrder
lookAt: LookAt | undefined = undefined
```

##### Bindings

```ts
inViewport: boolean
group: THREE.Object3D
```

### Misc

#### Fog

##### Properties

```ts
color: THREE.ColorRepresentation = defaults.fog.color
near = defaults.fog.near
far = defaults.fog.far
```

##### Bindings

```ts
fog: THREE.Fog
```

#### FogExp2

##### Properties

```ts
color: THREE.ColorRepresentation = defaults.fog.color
density = defaults.fog.density
```

##### Bindings

```ts
fog: THREE.FogExp2
```

#### Text

<!-- TODO -->

#### Layer

<!-- TODO -->

### Lights

#### AmbientLight

<!-- TODO -->

#### DirectionalLight

<!-- TODO -->

#### HemisphereLight

<!-- TODO -->

#### PointLight

<!-- TODO -->

#### SpotLight

<!-- TODO -->

### Cameras

#### OrthographicCamera

<!-- TODO -->

#### PerspectiveCamera

<!-- TODO -->

### Controls

#### OrbitControls

<!-- TODO -->

### Effects

#### Pass

<!-- TODO -->

### hooks

#### useThrelte

<!-- TODO -->

#### useThrelteRoot

<!-- TODO -->

#### useFrame

<!-- TODO -->

#### useTexture

<!-- TODO -->

## Concepts

Yes, there are already three.js component libraries for svelte, threlte is different in some ways:

- **Sensible defaults**  
  Much like [react-three-fiber](https://github.com/pmndrs/react-three-fiber), threlte will set sensible defaults to three.js `WebGLRenderer`, all colors and textures and more. This makes it easy for you to follow best practices in terms of color reception and accuracy.  
  threlte also makes visibility management a breeze with its `<Layer>` component.
- **Unified frame loop**  
  By default, threlte only renders the scene if there's need for it: If a prop changes that makes rendering the scene necessary, if there are any interactive objects in the scene or if threlte or you use `useFrame` in any of your components.
- **Interactivity**  
  threlte makes it possible to use events on three.js objects like they are regular DOM elements:  
   `<Mesh … interactive on:click={onClick}>`  
   You can even listen to your object leaving or entering the viewport:  
   `<Mesh … viewportAware on:viewportenter={onViewportEnter}>`
- **TypeScript**  
  All threlte components are written in TypeScript, so type support is a first-class citizen.
- **EffectComposer support**  
  Add a Pass with  
   `<Pass pass={new GlitchPass()} />` and threlte will take care of setting up the initial `RenderPass` and render to the `EffectComposer` instead of the `WebGLRenderer`.
- **Text rendering**  
  Render text using the fantastic [troika-three-text](https://github.com/protectwise/troika/tree/master/packages/troika-three-text) library with:
  `<Text text="Hello World" />`
- **Access All Areas**
  - Bind to three.js object instances  
    `<Mesh … bind:mesh>`
  - Access the renderer  
    `const { renderer, render } = useThrelte()`
- **Easily extendable**  
  Build objects that didn't yet make it to threlte yourself by plugging together _functional components_.
- **Tree-shakeble**  
  react-three-fiber is great at making it possible to use three.js classes as JSX components. This means that there is no hard dependency on a certain three.js version and everything that is possible in three.js is covered with react-three-fiber as well. There is however a downside: react-three-fiber looks up three.js classes at runtime. This means that even if your react-three-fiber app only uses a fraction of three.js, you will need to ship three.js in its entirety.  
  threlte does not look up three.js classes at runtime and as such is limited in features compared to three.js itself. It tries however to cover most use cases of three.js and provides _functional components_ to make extending threlte as easy as possible. As such, your bundler is able to tree-shake threlte and limit what parts of three.js get shipped.

### Interactivity

[Open the interactivity example in CodeSandbox](https://codesandbox.io/s/threlte-interactivity-example-t9hej?file=/App.svelte)

Listen to events of a `<Mesh>` and a `<MeshInstance>` as if it would be a regular DOM element:

```jsx
<Mesh … interactive on:click={onClick}>
```

These events are supported:

- `click`
- `contextmenu`
- `pointerup`
- `pointerdown`
- `pointerenter`
- `pointerleave`
- `pointermove`

All events include the raycast Intersection object:

```svelte
<script lang="ts">
  import { Mesh, ThrelteEvent } from 'threlte'

  const onClick = (e: CustomEvent<ThrelteEvent>) => {
    const distanceToMesh = e.detail.distance
  }
</script>

<Mesh … interactive on:click={onClick}>
```

You must add `interactive` to your Mesh to indicate adding the Mesh to the central event raycaster.  
Be aware that this will make the frameloop render on every frame.

### Viewport Awareness

[Open the viewport awareness example in CodeSandbox](https://codesandbox.io/s/threlte-viewport-awareness-example-i7hwy?file=/App.svelte)

Additionally, most Objects (Lights, Cameras, Meshes, …) can be made viewport aware. That means you can listen to events or bind a variable to check whether an object is in the viewport or not:

```svelte
<script lang="ts">
  import { PointLight } from 'threlte'
  import type { Object3D } from 'three'

  let inViewport

  const onViewportEnter = (e: CustomEvent<Object3D>) => {
    console.log('PointLight entered the viewport.')
  }
  const onViewportLeave = (e: CustomEvent<Object3D>) => {
    console.log('PointLight left the viewport.')
  }
</script>

<PointLight
  viewportAware
  bind:inViewport
  on:viewportenter={onViewportEnter}
  on:viewportleave={onViewportLeave}
/>
```

These events are supported:

- `viewportenter`
- `viewportleave`

Bind `inViewport` if you wish to not use events.

To make an Object viewport aware, you must add `viewportAware` to your Object.

### Reactivity

[Open the reactivity example in CodeSandbox](https://codesandbox.io/s/threlte-reactivity-example-vttvo?file=/App.svelte)

Just like [svelte-cubed](https://github.com/Rich-Harris/svelte-cubed) and much unlike [react-three-fiber](https://docs.pmnd.rs/react-three-fiber/advanced/pitfalls) it is encouraged to use your component state to drive your three.js scene.
By using props instead of manipulating three.js objects directly, the unified render loop is able to tell that your scene needs rerendering and svelte can make use of component optimizations.

## Credits

- [react-three-fiber](https://github.com/pmndrs/react-three-fiber)
- [svelte-cubed](https://github.com/Rich-Harris/svelte-cubed)
- [drei](https://github.com/pmndrs/drei)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
