'use server'

import { Livepeer } from 'livepeer'
import { Session } from 'livepeer/dist/models/components'
import { IExtendedSession } from '../types'
import { fetchEvent } from '../services/eventService'
import { fetchAsset } from '../services/sessionService'

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
})

export const getVideoPhaseAction = async (assetId: string) => {
  try {
    const asset = await fetchAsset({ assetId })
    if (asset.statusCode !== 200) {
      console.error(asset.rawResponse)
      return null
    }

    return asset.asset?.status?.phase.toString()
  } catch (e) {
    console.error('Error fetching asset: ', assetId)
    return null
  }
}

export const getVideoUrlAction = async (
  assetId?: string,
  playbackId?: string
) => {
  try {
    if (assetId) {
      const asset = await fetchAsset({ assetId })
      if (asset.statusCode !== 200) {
        console.error(asset.rawResponse)
      }

      if (asset.asset?.playbackUrl) {
        return asset.asset.playbackUrl
      }
    }

    if (playbackId) {
      return `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${playbackId}/index.m3u8`
    }

    return null
  } catch (e) {
    console.error('Error fetching asset: ', assetId)
    return null
  }
}

interface UrlActionParams {
  assetId?: string
  tusEndpoint?: string
  url?: string
}

export const getUrlAction = async (
  fileName: string
): Promise<UrlActionParams | null> => {
  try {
    const asset = await livepeer.asset.create({
      name: fileName,
      storage: {
        ipfs: true,
      },
    })

    if (!asset) {
      return null
    }
    const params: UrlActionParams = {
      tusEndpoint: asset?.object?.tusEndpoint,
      url: asset?.object?.url,
      assetId: asset?.object?.asset.id,
    }

    return params
  } catch (error) {
    console.error('Error fetching a Livepeer url:', error)
    return null
  }
}

export const generateThumbnail = async (
  session: IExtendedSession
) => {
  'use server'
  try {
    if (session.playbackId || session.assetId) {
      let playbackId = session.playbackId
      if (!playbackId) {
        const asset = await fetchAsset({
          assetId: session.assetId as string,
        })

        if (asset.statusCode === 200) {
          playbackId = asset.asset?.playbackId
        }
      }
      if (playbackId) {
        const asset = await livepeer.playback.get(
          playbackId as string
        )
        if (asset.statusCode === 200) {
          const lpThumbnails =
            asset.playbackInfo?.meta.source.filter(
              (source) => source.hrn === 'Thumbnails'
            ) ?? []
          if (lpThumbnails.length > 0) {
            return lpThumbnails[0].url.replace(
              'thumbnails.vtt',
              'keyframes_0.jpg'
            )
          }
        }
      }
    }

    if (session.eventId) {
      const coverResponse = (
        await fetchEvent({ eventId: session.eventId as string })
      )?.eventCover
      if (coverResponse) {
        return coverResponse
      }
    }

    return undefined

    throw new Error('No thumbnail found')
  } catch (e) {
    console.error('Error fetching thumbnail')
    return undefined
  }
}
