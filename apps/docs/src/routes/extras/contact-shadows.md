---
title: ContactShadows
---

<script lang="ts">
import Wrapper from '$examples/contact-shadows/Wrapper.svelte'
</script>

!!!module_summary title=ContactShadows|sourcePath=/components/ContactShadows/ContactShadows.svelte|name=ContactShadows|from=extras|type=component

This component is a port of [drei's `<ContactShadows>` component](https://github.com/pmndrs/drei#contactshadows) and makes its contents float or hover.

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
  import { BoxBufferGeometry, MeshBasicMaterial } from 'three'
  import { Mesh } from '@threlte/extras'
  import { ContactShadows } from 'threlte/extras'
</script>

<Mesh geometry={new BoxBufferGeometry(1, 1, 1)} material={new MeshBasicMaterial()}>
  <ContactShadows color="black" />
</Mesh>
```

### Properties

```ts
// optional
color: THREE.ColorRepresentation | undefined = undefined
material: THREE.Material | THREE.Material[] | undefined = undefined
threshold: number | undefined = undefined
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
interactive: boolean = false
ignorePointer: boolean = false
```

### Bindings

```ts
inViewport: boolean
```

### Events

```ts
viewportenter: undefined
viewportleave: undefined
click: CustomEvent<ThreltePointerEvent>
contextmenu: CustomEvent<ThreltePointerEvent>
pointerup: CustomEvent<ThreltePointerEvent>
pointerdown: CustomEvent<ThreltePointerEvent>
pointerenter: CustomEvent<ThreltePointerEvent>
pointerleave: CustomEvent<ThreltePointerEvent>
pointermove: CustomEvent<ThreltePointerEvent>
```
