<script lang="ts" context="module">
	import { writable, type Writable } from 'svelte/store'
	type CarContext = {
		speed: Writable<number>
	}

	export const useCar = () => {
		return getContext<CarContext>('threlte-car-context')
	}
</script>

<script lang="ts">
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat'
	import { Group, Mesh, useFrame, type Position, type Rotation } from '@threlte/core'
	import { HTML } from '@threlte/extras'
	import { AutoColliders, Collider, RigidBody, useRapier } from '@threlte/rapier'
	import { getContext, setContext } from 'svelte'
	import { BoxBufferGeometry, MeshStandardMaterial, Vector3 } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import Axle from './Axle.svelte'
	import { onDestroy } from 'svelte'
	import Damper from './Damper.svelte'
	import Wheel from './Wheel.svelte'

	export let position: Position | undefined = undefined
	export let rotation: Rotation | undefined = undefined

	let parentRigidBody: RapierRigidBody

	const carContext = {
		speed: writable(0)
	}

	const { speed } = carContext

	setContext<typeof carContext>('threlte-car-context', carContext)

	const { world } = useRapier()
	const v3 = new Vector3()

	useFrame(() => {
		const s = parentRigidBody.linvel()
		v3.set(s.x, s.y, s.z)
		carContext.speed.set(v3.length())
	})

	const initialIterations = {
		maxStabilizationIterations: world.maxStabilizationIterations,
		maxVelocityFrictionIterations: world.maxVelocityFrictionIterations,
		maxVelocityIterations: world.maxVelocityIterations
	}

	world.maxStabilizationIterations *= 100
	world.maxVelocityFrictionIterations *= 100
	world.maxVelocityIterations *= 100

	onDestroy(() => {
		world.maxStabilizationIterations = initialIterations.maxStabilizationIterations
		world.maxVelocityFrictionIterations = initialIterations.maxVelocityFrictionIterations
		world.maxVelocityIterations = initialIterations.maxVelocityIterations
	})

	const damperOffsetX = 1.2
	const damperOffsetZ = 0.6
	const damperOffsetY = -0.4
</script>

<Group {position} {rotation}>
	<RigidBody bind:rigidBody={parentRigidBody} canSleep={false}>
		<Collider mass={1} shape={'cuboid'} args={[1.5, 0.4, 0.5]} />

		<!-- CAR BODY MESH -->
		<Mesh
			castShadow
			geometry={new BoxBufferGeometry(3, 0.8, 1)}
			material={new MeshStandardMaterial()}
		/>

		<!-- CAMERA SLOT -->
		<slot />

		<HTML rotation={{ y: 90 * DEG2RAD }} transform position={{ x: 3 }}>
			<p class="text-xs text-black">
				{($speed * 3.6).toFixed(0)} km/h
			</p>
		</HTML>
	</RigidBody>

	<Damper
		position={{ x: -damperOffsetX, z: damperOffsetZ, y: damperOffsetY }}
		anchor={{ x: -damperOffsetX, z: damperOffsetZ, y: damperOffsetY }}
		{parentRigidBody}
		let:rigidBody
	>
		<Axle
			isSteered
			position={{}}
			anchor={{}}
			parentRigidBody={rigidBody}
			let:rigidBody={axleRigidBody}
		>
			<Wheel anchor={{ z: 0.18 }} position={{ z: 0.18 }} parentRigidBody={axleRigidBody} />
		</Axle>
	</Damper>

	<Damper
		position={{ x: -damperOffsetX, z: -damperOffsetZ, y: damperOffsetY }}
		anchor={{ x: -damperOffsetX, z: -damperOffsetZ, y: damperOffsetY }}
		{parentRigidBody}
		let:rigidBody
	>
		<Axle
			isSteered
			position={{}}
			anchor={{}}
			parentRigidBody={rigidBody}
			let:rigidBody={axleRigidBody}
		>
			<Wheel anchor={{ z: -0.18 }} position={{ z: -0.18 }} parentRigidBody={axleRigidBody} />
		</Axle>
	</Damper>

	<Damper
		position={{ x: damperOffsetX, z: -damperOffsetZ, y: damperOffsetY }}
		anchor={{ x: damperOffsetX, z: -damperOffsetZ, y: damperOffsetY }}
		{parentRigidBody}
		let:rigidBody
	>
		<Wheel anchor={{ z: -0.18 }} position={{ z: -0.18 }} isDriven parentRigidBody={rigidBody} />
	</Damper>

	<Damper
		position={{ x: damperOffsetX, z: damperOffsetZ, y: damperOffsetY }}
		anchor={{ x: damperOffsetX, z: damperOffsetZ, y: damperOffsetY }}
		{parentRigidBody}
		let:rigidBody
	>
		<Wheel anchor={{ z: 0.18 }} position={{ z: 0.18 }} isDriven parentRigidBody={rigidBody} />
	</Damper>
</Group>
