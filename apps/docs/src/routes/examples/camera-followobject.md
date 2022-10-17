---
title: Follow Object
---

<script lang="ts">
import Wrapper from '$examples/camera/followobject/Wrapper.svelte'
</script>

# Follow Object

<ExampleWrapper playgroundHref="/camera/followobject">
<Wrapper />

<div slot="code">

@[code svelte|title=Wrapper.svelte](../../examples/camera/followobject/Wrapper.svelte)
@[code svelte|title=Scene.svelte](../../examples/camera/followobject/Scene.svelte)
@[code svelte|title=Character.svelte](../../examples/camera/followobject/Character.svelte)
@[code svelte|title=ThirdPersonControls.svelte](../../examples/camera/followobject/ThirdPersonControls.svelte)

</div>
</ExampleWrapper>

This implementation was inspirsed by [SimonDev's](https://twitter.com/iced_coffee_dev) [ThirdPersonCamera](https://github.com/simondevyoutube/ThreeJS_Tutorial_ThirdPersonCamera). You could easily adapt it to work with a pointerlock too 😊