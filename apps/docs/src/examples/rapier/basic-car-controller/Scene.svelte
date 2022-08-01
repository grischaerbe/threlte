<script lang="ts">
	import {
		DirectionalLight,
		Mesh,
		Object3DInstance,
		OrbitControls,
		PerspectiveCamera,
		useLoader,
		useThrelte
	} from '@threlte/core'
	import { HTML, useGltf } from '@threlte/extras'
	import { AutoColliders, RigidBody } from '@threlte/rapier'
	import { onDestroy } from 'svelte'
	import { BoxBufferGeometry, EquirectangularReflectionMapping, MeshStandardMaterial } from 'three'
	import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import Car from './Car.svelte'
	import Ground from './Ground.svelte'

	const rgbeLoader = useLoader(RGBELoader, () => new RGBELoader())
	const { scene, invalidate } = useThrelte()
	const texture = rgbeLoader.load('/hdr/shanghai_riverside_1k.hdr', (texture) => {
		texture.mapping = EquirectangularReflectionMapping
		invalidate('texture loaded')
	})
	scene.environment = texture
	onDestroy(() => {
		texture.dispose()
	})

	const { gltf } = useGltf('/models/loop/loop.glb')
</script>

<!-- <PerspectiveCamera position={{ y: 5, x: 15, z: 15 }} fov={20}>
	<OrbitControls />
</PerspectiveCamera> -->

<DirectionalLight position={{ y: 20, x: 8, z: -3 }} />

<Ground />

<RigidBody dominance={1} position={{ y: 3, x: -10, z: -12 }}>
	<HTML transform sprite pointerEvents={'none'} position={{ y: 1 }}>
		<p>Dominance: 1</p>
	</HTML>
	<AutoColliders shape={'cuboid'}>
		<Mesh geometry={new BoxBufferGeometry(1, 1, 1)} material={new MeshStandardMaterial()} />
	</AutoColliders>
</RigidBody>

<RigidBody dominance={-1} position={{ y: 3, x: -15, z: -14 }}>
	<HTML transform sprite pointerEvents={'none'} position={{ y: 3 }}>
		<p>Dominance: -1</p>
	</HTML>
	<AutoColliders shape={'cuboid'}>
		<Mesh geometry={new BoxBufferGeometry(3, 3, 3)} material={new MeshStandardMaterial()} />
	</AutoColliders>
</RigidBody>

<RigidBody dominance={0} position={{ y: 3, x: -13, z: -10 }}>
	<HTML transform sprite pointerEvents={'none'} position={{ y: 2 }}>
		<p>Dominance: 0</p>
	</HTML>
	<AutoColliders shape={'cuboid'}>
		<Mesh geometry={new BoxBufferGeometry(2, 2, 2)} material={new MeshStandardMaterial()} />
	</AutoColliders>
</RigidBody>

{#if $gltf}
	<AutoColliders shape={'trimesh'}>
		<Object3DInstance
			rotation={{ y: 90 * DEG2RAD }}
			object={$gltf.scene}
			position={{ y: -0.3, x: -50, z: -3 }}
		/>
	</AutoColliders>
{/if}

<Car position={{ y: 5, x: 0 }}>
	<PerspectiveCamera
		rotation={{ x: -90 * DEG2RAD, z: 90 * DEG2RAD, y: 70 * DEG2RAD }}
		position={{ y: 5, x: 10 }}
		fov={60}
	/>
</Car>
