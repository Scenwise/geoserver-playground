import Image from 'next/image'
export default function ScenwiseLogo() {
  return (
    <div className="size-8 p-1 bg-black dark:bg-white rounded-sm grid place-items-center">
      <Image
        src="/scenwise.svg"
        alt="Scenwise logo"
        width={24}
        height={24}
        className="invert dark:invert-0"
      />
    </div>
  )
}
