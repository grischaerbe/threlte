---
title: Introduction
---

<script lang="ts">
import Wrapper from '$examples/Introduction/Wrapper.svelte'
</script>

# Introduction

Threlte is a component library for Svelte to build and render three.js scenes declaratively and state-driven in Svelte apps.

<ExampleWrapper>
	<Wrapper />
</ExampleWrapper>

&&&code_wrapper
@[code svelte|title=Wrapper.svelte](../examples/Introduction/Wrapper.svelte)
@[code svelte|title=Scene.svelte](../examples/Introduction/Scene.svelte)

:::admonition type="info"
Hooks that make use of the context (as does [useFrame](/core/use-frame) in this example) need to be nested in a child component to `<Canvas>`.
:::

&&&

It's inspired by the sensible defaults of [react-three-fiber](https://github.com/pmndrs/react-three-fiber), the simplicity and effectiveness of Sveltes reactivity model and [Svelte Cubed](https://github.com/Rich-Harris/svelte-cubed).

It provides strictly typed components to quickly and easily build three.js scenes with deep reactivity and interactivity out-of-the-box.

It also aims to provide the building blocks to quickly extend Threlte when it's needed.

:::admonition type="note"
Threlte is still in active development and you should expect breaking changes. Check the release notes before updating. If you want to be on the safe side, install Threlte with `npm i threlte three --save-exact` to lock the versions.
:::
