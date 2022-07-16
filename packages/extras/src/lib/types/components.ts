import type {
  GroupProperties,
  InteractiveObjectProperties,
  LineSegmentsProperties,
  MeshInstanceProperties,
  Object3DInstanceProperties
} from '@threlte/core'
import type { Camera, ColorRepresentation, Material, Object3D } from 'three'
import type { Text as TextType } from './types'

export type EdgesProperties = Omit<LineSegmentsProperties, 'geometry' | 'material'> &
  (
    | {
        color?: ColorRepresentation
        material: never
      }
    | {
        material?: Material | Material[]
        color: never
      }
  ) & {
    threshold?: number
  }

export type HTMLProperties = GroupProperties & {
  transform?: boolean
  calculatePosition: (
    obj: Object3D,
    camera: Camera,
    size: { width: number; height: number }
  ) => [number, number]
  eps: number
  occlude: boolean | Object3D[]
  zIndexRange: [number, number]
  sprite: boolean
  pointerEvents:
    | 'auto'
    | 'none'
    | 'visiblePainted'
    | 'visibleFill'
    | 'visibleStroke'
    | 'visible'
    | 'painted'
    | 'fill'
    | 'stroke'
    | 'all'
    | 'inherit'
  center: boolean
  fullscreen: boolean
  distanceFactor?: number
  as: keyof HTMLElementTagNameMap
  portal?: HTMLElement
}

export type FloatProperties = GroupProperties & {
  speed: number
  rotationIntensity: number
  floatIntensity: number
  floatingRange: [number, number]
}

export type TextProperties = Omit<MeshInstanceProperties, 'mesh'> & {
  text?: TextType['text']
  anchorX?: TextType['anchorX']
  anchorY?: TextType['anchorY']
  curveRadius?: TextType['curveRadius']
  font?: TextType['font']
  fontSize?: TextType['fontSize']
  letterSpacing?: TextType['letterSpacing']
  lineHeight?: TextType['lineHeight']
  maxWidth?: TextType['maxWidth']
  overflowWrap?: TextType['overflowWrap']
  textAlign?: TextType['textAlign']
  textIndent?: TextType['textIndent']
  whiteSpace?: TextType['whiteSpace']
  material?: TextType['material'] | null
  color?: TextType['color']
  depthOffset?: TextType['depthOffset']
  clipRect?: TextType['clipRect']
  glyphGeometryDetail?: TextType['glyphGeometryDetail']
  sdfGlyphSize?: TextType['sdfGlyphSize']
  outlineWidth?: TextType['outlineWidth']
  outlineColor?: TextType['outlineColor']
  outlineOpacity?: TextType['outlineOpacity']
  outlineBlur?: TextType['outlineBlur']
  outlineOffsetX?: TextType['outlineOffsetX']
  outlineOffsetY?: TextType['outlineOffsetY']
  strokeWidth?: TextType['strokeWidth']
  strokeColor?: TextType['strokeColor']
  strokeOpacity?: TextType['strokeOpacity']
  fillOpacity?: TextType['fillOpacity']
  direction?: TextType['direction']
}

export type GLTFProperties = Omit<Object3DInstanceProperties, 'object'> & {
  url: string
  dracoDecoderPath?: string
  ktxTranscoderPath?: string
} & Omit<InteractiveObjectProperties, 'object'>

export type ContactShadowProperties = Omit<GroupProperties, 'scale'> & {
  opacity?: number
  width?: number
  height?: number
  blur?: number
  far?: number
  smooth?: boolean
  resolution?: number
  frames?: number
  scale?: number | [x: number, y: number]
  color?: THREE.ColorRepresentation
  depthWrite?: boolean
}
