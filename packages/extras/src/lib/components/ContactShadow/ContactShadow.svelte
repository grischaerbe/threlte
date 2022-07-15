<script lang="ts" context="module">
  import { useFrame, useThrelte, type GroupProperties } from '@threlte/core'

  type ContactShadowProperties = Omit<GroupProperties, 'scale'> & {
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
</script>

<script lang="ts">
  import { CameraInstance, Group, Mesh } from '@threlte/core'
  import { onDestroy } from 'svelte'
  import {
    Color,
    Mesh as ThreeMesh,
    MeshBasicMaterial,
    MeshDepthMaterial,
    OrthographicCamera,
    PlaneBufferGeometry,
    ShaderMaterial,
    WebGLRenderTarget
  } from 'three'
  import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader'
  import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader'
  import { useMemo } from '../../lib/useMemo'

  // Group Properties
  export let position: ContactShadowProperties['position'] = undefined
  export let rotation: ContactShadowProperties['rotation'] = undefined
  export let lookAt: ContactShadowProperties['lookAt'] = undefined
  export let viewportAware: ContactShadowProperties['viewportAware'] = false
  export let inViewport: ContactShadowProperties['inViewport'] = false
  export let castShadow: ContactShadowProperties['castShadow'] = undefined
  export let receiveShadow: ContactShadowProperties['receiveShadow'] = undefined
  export let frustumCulled: ContactShadowProperties['frustumCulled'] = undefined
  export let renderOrder: ContactShadowProperties['renderOrder'] = undefined
  export let visible: ContactShadowProperties['visible'] = undefined

  // self
  export let opacity: NonNullable<ContactShadowProperties['opacity']> = 1
  export let width: NonNullable<ContactShadowProperties['width']> = 1
  export let height: NonNullable<ContactShadowProperties['height']> = 1
  export let blur: NonNullable<ContactShadowProperties['blur']> = 1
  export let far: NonNullable<ContactShadowProperties['far']> = 10
  export let smooth: NonNullable<ContactShadowProperties['smooth']> = true
  export let resolution: NonNullable<ContactShadowProperties['resolution']> = 512
  export let frames: NonNullable<ContactShadowProperties['frames']> = Infinity
  export let scale: NonNullable<ContactShadowProperties['scale']> = 10
  export let color: NonNullable<ContactShadowProperties['color']> = '#000000'
  export let depthWrite: NonNullable<ContactShadowProperties['depthWrite']> = false

  const { scene, renderer } = useThrelte()
  if (!renderer)
    throw new Error(
      'ContactShadow: WebGLRenderer is undefined, is this component a child of <Canvas>?'
    )

  const scaledWidth = useMemo(() => {
    return width * (Array.isArray(scale) ? scale[0] : scale || 1)
  })
  $: scaledWidth.memoize([width, scale])

  const scaledHeight = useMemo(() => {
    return height * (Array.isArray(scale) ? scale[1] : scale || 1)
  })
  $: scaledHeight.memoize(height, scale)

  const renderTarget = useMemo(() => {
    const rt = new WebGLRenderTarget(resolution, resolution)
    rt.texture.generateMipmaps = false
    rt.texture.encoding = renderer.outputEncoding
    return rt
  })
  $: renderTarget.memoize(resolution)

  const renderTargetBlur = useMemo(() => {
    const rt = new WebGLRenderTarget(resolution, resolution)
    rt.texture.generateMipmaps = false
    return rt
  })
  $: renderTargetBlur.memoize(resolution)

  const planeGeometry = useMemo(() => {
    return new PlaneBufferGeometry($scaledWidth, $scaledHeight).rotateX(Math.PI / 2)
  })
  $: planeGeometry.memoize($scaledWidth, $scaledHeight)

  const blurPlane = useMemo(() => {
    return new ThreeMesh($planeGeometry)
  })
  $: blurPlane.memoize($planeGeometry)

  const depthMaterial = useMemo(() => {
    const dm = new MeshDepthMaterial({
      depthTest: false,
      depthWrite: false
    })
    dm.onBeforeCompile = (shader) => {
      shader.uniforms = {
        ...shader.uniforms,
        ucolor: {
          value: new Color(color).convertSRGBToLinear()
        }
      }
      shader.fragmentShader = shader.fragmentShader.replace(
        `void main() {`, //
        `uniform vec3 ucolor;
           void main() {
          `
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4( vec3( 1.0 - fragCoordZ ), opacity );',
        'vec4( ucolor, ( 1.0 - fragCoordZ ) * 1.0 );'
      )
    }
    return dm
  })
  $: depthMaterial.memoize(color)

  const horizontalBlurMaterial = new ShaderMaterial({
    ...HorizontalBlurShader,
    depthTest: false
  })

  const verticalBlurMaterial = new ShaderMaterial({
    ...VerticalBlurShader,
    depthTest: false
  })

  const shadowCamera = new OrthographicCamera(
    -$scaledWidth / 2,
    $scaledWidth / 2,
    $scaledHeight / 2,
    -$scaledHeight / 2,
    0,
    far
  )
  shadowCamera.updateProjectionMatrix()

  const shadowMaterial = new MeshBasicMaterial({
    color: '#00ff00',
    map: $renderTarget.texture,
    transparent: true,
    opacity,
    depthWrite
  })

  const blurShadows = (blur: number) => {
    $blurPlane.visible = true

    $blurPlane.material = horizontalBlurMaterial
    horizontalBlurMaterial.uniforms.tDiffuse.value = $renderTarget.texture
    horizontalBlurMaterial.uniforms.h.value = (blur * 1) / 256

    renderer.setRenderTarget($renderTargetBlur)
    renderer.render($blurPlane, shadowCamera)

    $blurPlane.material = verticalBlurMaterial
    verticalBlurMaterial.uniforms.tDiffuse.value = $renderTargetBlur.texture
    verticalBlurMaterial.uniforms.v.value = (blur * 1) / 256

    renderer.setRenderTarget($renderTarget)
    renderer.render($blurPlane, shadowCamera)

    $blurPlane.visible = false
  }

  let count = 0
  useFrame(() => {
    if (frames === Infinity || count < frames) {
      const initialBackground = scene.background
      scene.background = null
      const initialOverrideMaterial = scene.overrideMaterial
      scene.overrideMaterial = $depthMaterial
      renderer.setRenderTarget($renderTarget)
      renderer.render(scene, shadowCamera)
      scene.overrideMaterial = initialOverrideMaterial

      blurShadows(blur)
      if (smooth) blurShadows(blur * 0.4)

      renderer.setRenderTarget(null)
      scene.background = initialBackground
      count++
    }
  })
  onDestroy(() => {
    debugger
  })
  onDestroy($renderTarget.dispose)
  onDestroy($renderTargetBlur.dispose)
  onDestroy($planeGeometry.dispose)
  onDestroy($depthMaterial.dispose)
  onDestroy(horizontalBlurMaterial.dispose)
  onDestroy(verticalBlurMaterial.dispose)
  onDestroy(shadowMaterial.dispose)
</script>

<Group
  rotation={{ x: Math.PI / 2 }}
  {position}
  {lookAt}
  {viewportAware}
  {inViewport}
  {castShadow}
  {receiveShadow}
  {frustumCulled}
  {visible}
>
  <Mesh
    material={shadowMaterial}
    geometry={$planeGeometry}
    {renderOrder}
    scale={{ y: -1 }}
    rotation={{ x: -Math.PI / 2 }}
  />
  <CameraInstance camera={shadowCamera} useCamera={false} />
</Group>
