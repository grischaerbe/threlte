// Hooks
export { useCursor } from './hooks/useCursor'
export { useGltf } from './hooks/useGltf'
export { useGltfAnimations } from './hooks/useGltfAnimations'
export { useProgress } from './hooks/useProgress'

// abstractions
export { default as Edges } from './components/Edges/Edges.svelte'
export { default as HTML } from './components/HTML/HTML.svelte'
export { default as Float } from './components/Float/Float.svelte'
export { default as GLTF } from './components/GLTF/GLTF.svelte'
export { default as ContactShadows } from './components/ContactShadows/ContactShadows.svelte'

// text component
export { default as Text } from './components/Text/Text.svelte'

export type {
  EdgesProperties,
  FloatProperties,
  HTMLProperties,
  TextProperties,
  GLTFProperties,
  ContactShadowProperties
} from './types/components'

export type { ThrelteGltf } from './types/types'
