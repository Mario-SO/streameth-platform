'use client'
import React from 'react'
import Player from '@/components/misc/Player'
import Image from 'next/image'
import Link from 'next/link'
import { IStage } from '@/server/model/stage'

const LiveEvent = ({ stage }: { stage: IStage }) => {
  return (
    <div>
      <h3 className="font-ubuntu font-bold px-4 mt-4 text-2xl text-blue">
        Happening Now!
      </h3>
      <div className="h-full flex flex-col w-full lg:flex-row relative lg:max-h-screen">
        <div className="h-full flex flex-col w-full lg:flex-row relative items-center lg:gap-4">
          <div className=" mb-2 lg:mb-0 p-4 rounded-xl flex flex-col lg:h-full w-full box-border lg:overflow-scroll lg:w-[75%]">
            <Player
              streamId={stage.streamSettings.streamId}
              playerName={stage.name}
            />
            <p className="font-ubuntu font-medium text-lg mt-4 text-blue">
              🔴 Live: ETHGünü
            </p>
          </div>
          <div
            className={`w-full lg:w-[45%] mr-4 flex flex-col gap-4 mb-4`}>
            <p className="hidden lg:block font-ubuntu font-medium text-lg text-blue">
              ETHGünü
            </p>
            <Image
              className="hidden lg:block"
              src={'/events/ETHGunu_cover.jpeg'}
              alt="ETHGunu 2023"
              width={700}
              height={700}
            />
            <Link
              href="/devconnect/ethgunu"
              className=" bg-blue rounded-[8px] p-4 mx-4 lg:mx-0 text-white text-center">
              Go to Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveEvent
