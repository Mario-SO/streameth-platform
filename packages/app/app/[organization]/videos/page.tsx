import {
  ChannelPageParams,
  IExtendedEvent,
  OrganizationPageProps,
} from '@/lib/types'
import { Metadata, ResolvingMetadata } from 'next'
import { fetchEvents } from '@/lib/services/eventService'
import { Suspense } from 'react'
import ArchiveVideos from './components/ArchiveVideos'
import ArchiveVideoSkeleton from '../livestream/components/ArchiveVideosSkeleton'
import Image from 'next/image'
import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'
import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite'
import EventSelect from './components/eventSelect'
import { fetchAllSessions } from '@/lib/data'

export default async function ArchivePage({
  params,
  searchParams,
}: OrganizationPageProps) {
  if (!params.organization) {
    return notFound()
  }

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  }

  const events = await fetchEvents({
    organizationId: organization?._id,
  })

  const results = await Promise.all(
    events.map(async (event) => {
      const sessions = (
        await fetchAllSessions({
          event: event._id.toString(),
          onlyVideos: true,
        })
      ).sessions

      return sessions.length > 0 ? event : undefined
    })
  )

  const eventsWithVideos = results.filter(
    (event) => event !== undefined
  )

  return (
    <div>
      <div className="hidden relative w-full h-full md:block max-h-[200px] aspect-video">
        {organization.banner ? (
          <Image
            src={organization.banner}
            alt="banner"
            quality={100}
            objectFit="cover"
            fill
            priority
          />
        ) : (
          <div className="h-full bg-gray-300 rounded-xl md:rounded-none max-h-[200px]">
            <StreamethLogoWhite />
          </div>
        )}
      </div>
      <div className="p-4 m-auto w-full max-w-7xl">
        <div className="flex flex-row justify-between items-center mb-4 space-x-2 w-full">
          <div className="w-full text-lg font-bold">All videos</div>
          <div>
            <EventSelect
              events={eventsWithVideos as IExtendedEvent[]}
            />
          </div>
        </div>
        <Suspense fallback={<ArchiveVideoSkeleton />}>
          <ArchiveVideos
            organizationSlug={params.organization}
            searchQuery={searchParams.searchQuery || ''}
            page={Number(searchParams.page || 1)}
            event={searchParams.event}
          />
        </Suspense>
      </div>
    </div>
  )
}

export async function generateMetadata(
  { params }: ChannelPageParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const organizationInfo = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organizationInfo) {
    return {
      title: 'Organization not found',
      description: 'Organization not found',
    }
  }

  const imageUrl = organizationInfo.logo
  try {
    return {
      title: organizationInfo.name,
      description: organizationInfo.description,
      openGraph: {
        images: [imageUrl],
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: organizationInfo.name,
      description: organizationInfo.description,
    }
  }
}
