<script lang="ts">
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat'
	import { Group, type Position } from '@threlte/core'
	import { Collider, RigidBody, usePrismaticJoint } from '@threlte/rapier'

	export let position: Position | undefined = undefined
	export let parentRigidBody: RapierRigidBody | undefined = undefined
	export let anchor: Position

	let damperRigidBody: RapierRigidBody

	const { joint, rigidBodyA, rigidBodyB } = usePrismaticJoint(anchor, {}, { y: 1 }, [0, 0.2])
	$: if (parentRigidBody) rigidBodyA.set(parentRigidBody)
	$: if (damperRigidBody) rigidBodyB.set(damperRigidBody)
	$: $joint?.setContactsEnabled(false)
	$: $joint?.configureMotorPosition(0.05, 800, 60)
</script>

<Group {position}>
	<RigidBody bind:rigidBody={damperRigidBody}>
		<Collider mass={1} shape={'cuboid'} args={[0.03, 0.03, 0.03]} />
	</RigidBody>

	<slot rigidBody={damperRigidBody} />
</Group>
