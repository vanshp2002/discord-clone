import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { Autoplay, EffectCoverflow, Pagination, Navigation, Keyboard } from 'swiper/modules';

import "@/components/css/view-story-modal.css";
import { useParams } from "next/navigation";
import { UserAvatar } from "../user-avatar";

export const ViewStatusModal = ({}) => {

    const {isOpen,onClose,data,type} = useModal();
    const params = useParams();
    
    const isModalOpen = isOpen && type==="viewStatus";

    const handleClose = () => {
        setFileUrl([]);
        setIsVideo([]);
        onClose();
    }

    const {currIndex, statuses} = data;
    const [guser, setGuser] = useState(null);
    const [fileUrl, setFileUrl] : any = useState([]);
    const [isVideo, setIsVideo] : any = useState([]);
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



    // return (

    //     <Dialog open={isModalOpen} onOpenChange={handleClose}>
    //         <DialogContent  className="bg-zinc-900 text-white p-4 max-w-md max-h-md mx-auto rounded-lg">

    //         <div className="flex justify-between items-center p-2 mt-6">
    //             <div className="flex items-center gap-x-2">
    //                 <UserAvatar src={guser?.imageUrl} className="w-6 h-6 md:w-7 md:h-7" />
    //                 <p className="text-white ml-2">{guser?.displayname}</p>
    //             </div>
    //             <p> {currIndex+1}/{fileUrl.length} </p>
    //         </div>

    //         <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md" style={{ maxWidth: "93%" }}/>

    //         <div className="flex items-center">

    //             <ChevronLeft onClick={() => setCurrIndex(Math.max(currIndex-1,0))} className=" text-white" style={{zIndex: 3}}/>
                
    //             <div className="flex items-center justify-between w-full">
                    
    //                 <div className="flex items-center p-4">
    //                     {fileUrl.length > 0 && isVideo[currIndex] ?
    //                         <video src={fileUrl[currIndex]} controls className="w-auto h-full" />
    //                         :
    //                         <div className=" p-3 mx-auto w-auto h-full ">
    //                             <img src={fileUrl[currIndex]} /> 
    //                         </div>
    //                     }
    //                 </div>
                
    //             </div>
    //             <ChevronRight onClick={() => setCurrIndex(Math.min(currIndex+1,fileUrl.length-1))} className=" text-white" style={{zIndex: 3}} />
    //                 </div>
    //         </DialogContent>
    //     </Dialog>

    // )

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
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={3}
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
                    >
                    {friendStatuses && friendStatuses.map((friend: any,index: any) => (
                        <SwiperSlide key={friend._id} className="bg-black p-4">
                            <div className="flex items-center gap-x-2">
                                <UserAvatar src={friend.imageUrl} className="w-6 h-6 md:w-7 md:h-7" />
                                <p className="text-white ml-2">{friend.username}</p>
                            </div>
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
                                >
                                {friend.status.map((status: any) => (
                                    <SwiperSlide key={status._id}>
                                    <div className="flex items-center p-4">
                                            <div key={status._id} className=" p-2 mx-auto py-3">
                                                {status.src.includes("mp4") ?  
                                                    <video src={status.src} controls className="w-auto mx-auto" />
                                                    :
                                                    <img src={status.src} className="w-auto mx-auto"/> 
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