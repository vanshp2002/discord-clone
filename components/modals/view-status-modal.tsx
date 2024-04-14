import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { Autoplay, EffectCoverflow, Pagination, Navigation, Keyboard, EffectCube } from 'swiper/modules';

import "@/components/css/view-story-modal.css";
import { useParams } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { set } from "mongoose";

export const ViewStatusModal = ({ }) => {

    const { isOpen, onClose, data, type } = useModal();
    const params = useParams();
    const outerSwiperRef = useRef(null);

    const isModalOpen = isOpen && type === "viewStatus";

    const handleClose = () => {
        setOuterSwiperIndex(0);
        setFileUrl([]);
        setIsVideo([]);
        onClose();
    }

    const { currIndex, statuses } = data;
    const [outerSwiperIndex, setOuterSwiperIndex] = useState(currIndex);
    const [guser, setGuser] = useState(null);
    const [fileUrl, setFileUrl]: any = useState([]);
    const [isVideo, setIsVideo]: any = useState([]);
    const [friendStatuses, setFriendStatuses] = useState(statuses);

    useEffect(() => {
        setFriendStatuses(statuses);
    }, [statuses]);

    //esc key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isModalOpen]);

    const toggleModal = () => {
        onClose();
    };

    return (
        <>
            {isModalOpen &&
                <div className="modal-container">
                    <div className="modal">
                        <div onClick={handleClose} className="overlay"></div>
                        <div className="modal-content">
                            <Swiper
                                ref={outerSwiperRef}
                                effect={'coverflow'}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={4}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true,
                                }}
                                pagination={true}
                                modules={[EffectCoverflow, Pagination]}
                                className="mySwiper"
                                initialSlide={currIndex}
                                onSlideChange={(swiper) => {

                                    setTimeout(() => {
                                        setOuterSwiperIndex(swiper.activeIndex);
                                        const video = document.getElementById(`${swiper.activeIndex}-0`);
                                        if (video) {
                                            video.play();
                                        }
                                    }, 100); // Adjust the delay time as needed

                                }}
                            >
                                {friendStatuses && friendStatuses.map((friend: any, outerIndex: any) => (
                                    <SwiperSlide key={friend._id} className="bg-black p-4">

                                        <div >
                                            <Swiper
                                                slidesPerView={1}
                                                spaceBetween={20}
                                                keyboard={{
                                                    enabled: true,
                                                }}
                                                pagination={{
                                                    clickable: true,
                                                }}
                                                navigation={true}
                                                modules={[Keyboard, Pagination, Navigation]}
                                                className="mySwiper2"
                                                onSlideChange={(swiper) => {
                                                    const activeSlide = swiper.slides[swiper.activeIndex];
                                                    const video = activeSlide.querySelector('video');

                                                    if (video) {
                                                        video.play();
                                                    }
                                                }}
                                            >
                                                {friend.status.map((status: any, index: any) => (
                                                    <SwiperSlide key={status._id}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-x-2">
                                                                <UserAvatar src={friend.imageUrl} className="w-8 h-8 md:w-10 md:h-10" />
                                                                <p className="text-white ml-2">{friend.username}</p>
                                                            </div>
                                                            <p className="text-sm mr-4"> {index + 1}/{friend.status.length} </p>
                                                        </div>
                                                        <div className="flex items-center p-4">
                                                            <div key={status._id} className=" p-2 mx-auto py-3">
                                                                {status.src.includes("mp4") ? (
                                                                    index === 0 && outerIndex === 0 && currIndex === 0 ?
                                                                        <video id={`${outerIndex}-${index}`} src={status.src} controls className="w-auto mx-auto" autoPlay />
                                                                        :
                                                                        <video id={`${outerIndex}-${index}`} src={status.src} controls className="w-auto mx-auto" />
                                                                )
                                                                    :
                                                                    <img src={status.src} className="w-auto mx-auto" />
                                                                }
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            }
        </>
    )

}