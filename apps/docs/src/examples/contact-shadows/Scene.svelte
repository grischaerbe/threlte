<script lang="ts">
	import {
		AmbientLight,
		DirectionalLight,
		Mesh,
		OrbitControls,
		PerspectiveCamera,
		useFrame,
		useLoader,
		useThrelte
	} from '@threlte/core'
	import { ContactShadows, Float } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { EquirectangularReflectionMapping } from 'three'
	import {
		BoxBufferGeometry,
		Color,
		GridHelper,
		IcosahedronBufferGeometry,
		MeshStandardMaterial,
		TorusKnotBufferGeometry
	} from 'three'
	import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

	const material = new MeshStandardMaterial({
		color: 0x0000ff
	})

	const { scene, invalidate } = useThrelte()

	const gridHelper = new GridHelper(10, 10)
	gridHelper.position.y = -0.01
	scene.add(gridHelper)
	onDestroy(() => {
		scene.remove(gridHelper)
	})

	const rgbeLoader = useLoader(RGBELoader, () => new RGBELoader())
	const texture = rgbeLoader.load('/hdr/shanghai_riverside_1k.hdr', (texture) => {
		texture.mapping = EquirectangularReflectionMapping
		invalidate('texture loaded')
	})
	scene.environment = texture
	onDestroy(() => {
		texture.dispose()
	})

	let pos = {
		x: 0
	}
	useFrame(() => {
		pos.x = Math.sin(Date.now() / 2000)
	})
</script>

<PerspectiveCamera position={{ y: 10, x: -10, z: 10 }} fov={25}>
	<OrbitControls enabled={false} autoRotate autoRotateSpeed={0.5} target={{ y: 1 }} />
</PerspectiveCamera>

<DirectionalLight intensity={0.8} position={{ y: 10, x: 5 }} />
<AmbientLight intensity={0.2} />

<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />

<Float floatIntensity={1} floatingRange={[0, 1]}>
	<Mesh
		position={{ y: 1.2, z: -0.75 }}
		geometry={new BoxBufferGeometry(1, 1, 1)}
		material={new MeshStandardMaterial({
			color: new Color('#0059BA').convertSRGBToLinear()
		})}
	/>
</Float>

<Float floatIntensity={1} floatingRange={[0, 1]}>
	<Mesh
		position={{ y: 1.5, x: 1.2, z: 0.75 }}
		rotation={{ x: 5, y: 71 }}
		geometry={new TorusKnotBufferGeometry(0.5, 0.15, 100, 12, 2, 3)}
		material={new MeshStandardMaterial({
			color: new Color('#F85122').convertSRGBToLinear()
		})}
	/>
</Float>

<Float floatIntensity={1} floatingRange={[0, 1]}>
	<Mesh
		position={{ y: 1.5, x: -1.4, z: 0.75 }}
		rotation={{ x: -5, y: 128, z: 10 }}
		geometry={new IcosahedronBufferGeometry(1, 0)}
		material={new MeshStandardMaterial({
			color: new Color('#F8EBCE').convertSRGBToLinear()
		})}
	/>
</Float>
