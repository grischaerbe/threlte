<script lang="ts">
	import type {
		RevoluteImpulseJoint,
		RigidBody as RapierRigidBody
	} from '@dimforge/rapier3d-compat'
	import { Group, type Position } from '@threlte/core'
	import { Collider, RigidBody, useFixedJoint, useRevoluteJoint } from '@threlte/rapier'
	import { spring } from 'svelte/motion'
	import { clamp, DEG2RAD, mapLinear } from 'three/src/math/MathUtils'
	import { useCar } from './Car.svelte'
	import { useWasd } from './useWasd'

	export let position: Position | undefined = undefined
	export let parentRigidBody: RapierRigidBody | undefined = undefined
	export let anchor: Position
	export let isSteered: boolean = false

	let axleRigidBody: RapierRigidBody

	const wasd = useWasd()
	const { speed } = useCar()

	const steeringAngle = spring(mapLinear(clamp($speed / 12, 0, 1), 0, 1, 1, 0.5) * $wasd.x * 15)
	$: steeringAngle.set(mapLinear(clamp($speed / 12, 0, 1), 0, 1, 1, 0.5) * $wasd.x * 15)

	const { joint, rigidBodyA, rigidBodyB } = isSteered
		? useRevoluteJoint(anchor, {}, { y: 1 })
		: useFixedJoint(anchor, {}, {}, {})
	$: if (parentRigidBody) rigidBodyA.set(parentRigidBody)
	$: if (axleRigidBody) rigidBodyB.set(axleRigidBody)
	$: $joint?.setContactsEnabled(false)
	$: if (isSteered) {
		;($joint as RevoluteImpulseJoint)?.configureMotorPosition(
			$steeringAngle * -1 * DEG2RAD,
			1000000,
			0
		)
	}
</script>

<Group {position}>
	<RigidBody bind:rigidBody={axleRigidBody}>
		<Collider mass={1} shape={'cuboid'} args={[0.03, 0.03, 0.03]} />
	</RigidBody>

	<slot rigidBody={axleRigidBody} />
</Group>
