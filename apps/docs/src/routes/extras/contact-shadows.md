---
title: ContactShadows
---

<script lang="ts">
import Wrapper from '$examples/contact-shadows/Wrapper.svelte'
</script>

!!!module_summary title=ContactShadows|sourcePath=/components/ContactShadows/ContactShadows.svelte|name=ContactShadows|from=extras|type=component

This component is a port of [drei's `<ContactShadows>` component](https://github.com/pmndrs/drei#contactshadows).

<ExampleWrapper>
  <Wrapper />
</ExampleWrapper>

&&&code_wrapper
@[code svelte|title=Wrapper.svelte](../../examples/contact-shadows/Wrapper.svelte)
@[code svelte|title=Scene.svelte](../../examples/contact-shadows/Scene.svelte)
&&&

!!!

### Example

```svelte
<script lang="ts">
  import { ContactShadows } from 'threlte/extras'
</script>

<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />
```

### Properties

```ts
// optional
position: Position | undefined = undefined
scale: Scale | undefined = undefined
rotation: Rotation | undefined = undefined
lookAt: LookAt | undefined = undefined
viewportAware: boolean = false
castShadow: boolean | undefined = undefined
receiveShadow: boolean | undefined = undefined
frustumCulled: boolean | undefined = undefined
renderOrder: number | undefined = undefined
visible: boolean | undefined = undefined
opacity: number = 1
width: number = 1
height: number = 1
blur: number = 1
far: number = 10
smooth: boolean = true
resolution: number = 512
frames: number = Infinity
scale: number | [x: number, y: number] = 10
color: THREE.ColorRepresentation = '#000000'
depthWrite: boolean = false
```

### Bindings

```ts
inViewport: boolean
```

### Events

```ts
viewportenter: undefined
viewportleave: undefined
```
