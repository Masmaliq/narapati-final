import Image, {type ImageProps} from 'next/image'

type WatermarkedImageProps = ImageProps & {
  watermark?: 'story' | 'moment'
}

export function WatermarkedImage({watermark = 'story', ...props}: WatermarkedImageProps) {
  const tagline = watermark === 'moment' ? 'Keep The Moment.' : 'Keep The Story.'

  return (
    <>
      <Image {...props} />
      <span className="narapati-watermark" aria-hidden="true">
        <span>N</span>
        <small>{tagline}</small>
      </span>
    </>
  )
}
