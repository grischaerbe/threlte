<script lang="ts">
	import { AmbientLight, PerspectiveCamera, useLoader, useThrelte } from '@threlte/core'
	import { Mesh } from '@threlte/core'
	import { Float, GLTF, HTML, useGltf } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { spring } from 'svelte/motion'
	import { derived } from 'svelte/store'
	import type { Mesh as ThreeMesh } from 'three'
	import { MeshStandardMaterial } from 'three'
	import { Color } from 'three'
	import { EquirectangularReflectionMapping } from 'three'
	import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
	import { DEG2RAD } from 'three/src/math/MathUtils'

	const rgbeLoader = useLoader(RGBELoader, () => new RGBELoader())
	const { scene, invalidate } = useThrelte()

	const texture = rgbeLoader.load('/hdr/shanghai_riverside_1k.hdr', () => {
		invalidate('texture loaded')
	})
	texture.mapping = EquirectangularReflectionMapping
	scene.environment = texture

	onDestroy(() => {
		texture.dispose()
	})

	const { pointer } = useThrelte()

	const offsetX = spring($pointer.x * 10)
	$: offsetX.set($pointer.x * 10)
	const offsetY = spring($pointer.y * 10)
	$: offsetY.set($pointer.y * 10)

	const { gltf } = useGltf<'phone'>('/models/phone/phone.glb')
	const phoneGeometry = derived(gltf, (gltf) => {
		if (!gltf) return
		return (gltf.nodes.phone as ThreeMesh).geometry
	})
</script>

<PerspectiveCamera position={{ z: $offsetX, x: 50, y: -$offsetY }} fov={20} lookAt={{}} />

<AmbientLight intensity={0.3} />

<Float scale={0.7}>
	<HTML rotation={{ y: DEG2RAD * 90 }} position={{ x: 1.2 }} transform>
		<div class="h-[848px] w-[420px] rounded-[63px] overflow-hidden border border-black/10">
			<iframe title="" src="http://localhost:3000" width="100%" height="100%" frameborder="0" />
		</div>
	</HTML>

	{#if $phoneGeometry}
		<Mesh
			scale={5.65}
			geometry={$phoneGeometry}
			material={new MeshStandardMaterial({
				color: new Color('#FF3F00').convertSRGBToLinear()
			})}
		/>
	{/if}

	<!-- <GLTF scale={5.65} url="/models/phone/phone.glb" /> -->
</Float>
