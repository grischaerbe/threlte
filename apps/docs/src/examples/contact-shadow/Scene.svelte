<script lang="ts">
	import { writable } from 'svelte/store'
	import { BoxBufferGeometry, Color, MeshStandardMaterial } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import {
		AmbientLight,
		DirectionalLight,
		Group,
		Mesh,
		OrbitControls,
		OrthographicCamera,
		PerspectiveCamera,
		useFrame,
		useThrelte
	} from '@threlte/core'
	import { useCursor, Text, ContactShadow, Float, HTML } from '@threlte/extras'
	import { GridHelper } from 'three'
	import { onDestroy } from 'svelte'
	import { IcosahedronBufferGeometry } from 'three'
	import { TorusKnotBufferGeometry } from 'three'

	const material = new MeshStandardMaterial({
		color: 0x0000ff
	})

	const { scene } = useThrelte()

	const gridHelper = new GridHelper(10, 10)
	gridHelper.position.y = -0.01
	scene.add(gridHelper)
	onDestroy(() => {
		scene.remove(gridHelper)
	})

	let pos = {
		x: 0
	}
	useFrame(() => {
		pos.x = Math.sin(Date.now() / 2000)
	})
</script>

<PerspectiveCamera position={{ y: 10, x: -10, z: 10 }}>
	<OrbitControls />
</PerspectiveCamera>

<DirectionalLight position={{ y: 10, x: 5 }} />
<AmbientLight intensity={0.2} />

<ContactShadow scale={10} blur={2} far={2} opacity={1} />

<Float floatIntensity={1} floatingRange={[0, 1]}>
	<Mesh position={{ y: 1.2, z: -0.75 }} geometry={new BoxBufferGeometry(1, 1, 1)} {material} />
</Float>

<Float floatIntensity={1} floatingRange={[0, 1]}>
	<Mesh
		position={{ y: 1.5, x: 1.2, z: 0.75 }}
		rotation={{ x: 5, y: 71 }}
		geometry={new TorusKnotBufferGeometry(0.5, 0.15, 100, 12, 2, 3)}
		{material}
	/>
</Float>

<Float floatIntensity={1} floatingRange={[0, 1]}>
	<Mesh
		position={{ y: 1.5, x: -1.4, z: 0.75 }}
		rotation={{ x: -5, y: 128, z: 10 }}
		geometry={new IcosahedronBufferGeometry(1, 0)}
		{material}
	/>
</Float>
