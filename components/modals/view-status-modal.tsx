import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaTrash } from "react-icons/fa";

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/effect-cube';

import { Autoplay, EffectCoverflow, Pagination, Navigation, Keyboard, EffectCube } from 'swiper/modules';

import "@/components/css/view-story-modal.css";
import { useParams } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { set } from "mongoose";
import { on } from "events";

export const ViewStatusModal = ({}) => {

    const {onOpen, isOpen, onClose, data, type} = useModal();
    const params = useParams();
    const outerSwiperRef = useRef(null);
    const ownStatusSwiperRef = useRef(null);
    const marginTopPercentage = 100;

    const isModalOpen = isOpen && type==="viewStatus";

    const handleClose = () => {
        setOuterSwiperIndex(0);
        onClose();
    }

    const {currIndex, statuses} = data;
    const [outerSwiperIndex, setOuterSwiperIndex] = useState(currIndex);
    const [guser, setGuser] = useState(null);
    const [friendStatuses, setFriendStatuses] = useState(statuses);

    useEffect(() => {
        setFriendStatuses(statuses);
    }, [statuses] );

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

    const onAddStory = (userId: string) => {
        onClose();
        onOpen("uploadStatus", {user: userId});
    }

    const deleteOwnStory = async (statusId: string) => {
        const res = await fetch("/api/status/deletestatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                statusId: statusId
            })
        });
        let newFriendStatuses = friendStatuses;
        newFriendStatuses[0].status = newFriendStatuses[0].status.filter((status: any) => status._id !== statusId);
        setFriendStatuses(newFriendStatuses);
    }

    if(currIndex===-1){
        return (
            <>
            
                {isModalOpen &&
                <div className="modal-container">
                    <div className="modal">
                        <div onClick={handleClose} className="overlay"></div>
                        <div className="modal-content">
                        <div className="fixed top-0  w-auto h-full flex justify-between items-center z-50 ">
                    <div className="bg-black p-6 rounded-lg max-w-md max-h-3/4 overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <Swiper
                            ref={ownStatusSwiperRef}
                            effect={'cube'}
                            grabCursor={true}
                            cubeEffect={{
                            shadow: true,
                            slideShadows: true,
                            shadowOffset: 20,
                            shadowScale: 0.94,
                            }}
                            pagination={true}
                            modules={[EffectCube, Pagination]}
                            className="mySwiper"
                            onSlideChange={(swiper) => {  
                        
                                setTimeout(() => {
                                    const video = document.getElementById(`v-1-${swiper.activeIndex}`);
                                    if (video) {
                                        video.play();
                                    }
                                }, 100); // Adjust the delay time as needed
                            
                            }}
                        >
                            {friendStatuses && friendStatuses[0].status.map((status: any, index: any) => (
                                <SwiperSlide key={status._id} className="bg-black p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-x-2">
                                        <UserAvatar src={friendStatuses[0].imageUrl} className="w-8 h-8 md:w-10 md:h-10" />
                                        <p className="text-white ml-2">Your Story</p>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <FaTrash className="text-zinc-600 hover:text-red-600" onClick={() => deleteOwnStory(status._id)}/>
                                        <p className="text-sm mr-4"> {index+1}/{friendStatuses[0].status.length} </p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 h-full">
                                        <div className="flex items-center justify-center mx-auto py-auto">
                                            {status.src.includes("mp4") ?  (
                                                index === 0 ? (
                                                    <video id={`v-1-${index}`} src={status.src} controls className="w-auto mx-auto my-auto" autoPlay />
                                                )
                                                :
                                                <video id={`v-1-${index}`} src={status.src} controls className="w-auto mx-auto my-auto" />
                                            )
                                                :
                                                <img src={status.src} className="w-auto mx-auto my-auto"/> 
                                            }
                                        </div>
                                </div>
                                </SwiperSlide>
                            ))}

                            {friendStatuses && <SwiperSlide className="flex bg-black p-4 h-full container my-auto ">
                                <div className="flex items-center justify-between absolute top-0">
                                    <div className="flex items-center gap-x-2">
                                        <UserAvatar src={friendStatuses[0]?.imageUrl} className="w-8 h-8 md:w-10 md:h-10" />
                                        <p className="text-white ml-2">Your Story</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center p-4 container h-full "> 
                                    <div className="p-2 my-auto">
                                        <div className="flex items-center justify-center bg-black h-full">
                                            <div className="justify-center mx-auto">
                                                <Plus onClick={() => onAddStory(friendStatuses[0]?._id)} className="h-10 w-10 ml-9 text-green-600" />
                                                <p className="py-2 mt-1 text-sm">
                                                    Add to your story
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </SwiperSlide>}
                        </Swiper>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
                }

            </>
        )
    }

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
                            const video = document.getElementById(`v${swiper.activeIndex}-0`);
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
                                    className="mySwipertwo"
                                    onSlideChange={(swiper) => {
                                        const activeSlide = swiper.slides[swiper.activeIndex];
                                        const video = activeSlide.querySelector('video');
                                
                                        if (video) {
                                            video.play();
                                        }
                                    }}
                                >
                                {friend.status.map((status: any, index :any) => (
                                    <SwiperSlide key={status._id}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-x-2">
                                                    <UserAvatar src={friend.imageUrl} className="w-8 h-8 md:w-10 md:h-10" />
                                                    <p className="text-white ml-2">{friend.username}</p>
                                                </div>
                                                <p className="text-sm mr-4"> {index+1}/{friend.status.length} </p>
                                            </div>
                                            <div className="flex items-center px-4 h-full my-auto">
                                                    <div key={status._id} className="flex-col items-center justify-center px-2 mx-auto py-auto">
                                                        {status.src.includes("mp4") ?  (
                                                            index === 0 && outerIndex===0 && currIndex===0?
                                                            <video id={`v${outerIndex}-${index}`} src={status.src} controls className="w-auto mx-auto my-auto" autoPlay />
                                                            :
                                                            <video id={`v${outerIndex}-${index}`}  src={status.src} controls className="w-auto mx-auto my-auto" />
                                                        )
                                                            :
                                                            <img src={status.src} className="my-auto" id={`${outerIndex}-${index}`} alt="Status"  />
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