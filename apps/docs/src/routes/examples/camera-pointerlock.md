---
title: Pointer Locking
---

<script lang="ts">
import Wrapper from '$examples/camera/pointerlock/Wrapper.svelte'
</script>

# Pointer Locking

<ExampleWrapper playgroundHref="/camera/pointerlock">
<Wrapper />

<div slot="code">

@[code svelte|title=Wrapper.svelte](../../examples/camera/pointerlock/Wrapper.svelte)
@[code svelte|title=Scene.svelte](../../examples/camera/pointerlock/Scene.svelte)
@[code svelte|title=Character.svelte](../../examples/camera/pointerlock/Character.svelte)
@[code svelte|title=PointerLockControls.svelte](../../examples/camera/pointerlock/PointerLockControls.svelte)

</div>
</ExampleWrapper>

This implementation of PointerLockControls is a remix of three.js's pointerlock controls but more svelte'y 🚀

Remember remixing three.js more for your purpose is an option.