import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import { EffectCube, Pagination } from 'swiper/modules';
import { useModal } from "@/hooks/use-modal-store";

export const ViewStatusModal = () => {
    const { isOpen, onClose, data, type } = useModal();
    const isModalOpen = isOpen && type === "viewStatus";

    const handleClose = () => {
        onClose();
    }

    const { user } = data;
    const [fileUrl, setFileUrl] = useState([]);
    const [isVideo, setIsVideo] = useState([]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch("/api/getuserbyid/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user
                    })
                });
                const { user: usertemp } = await response.json();
                // setGuser(usertemp);

                const res = await fetch("/api/status/getstatus/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user
                    })
                });
                const { status: statuses } = await res.json();

                if (statuses.length > 0) {
                    setFileUrl([]);
                    setIsVideo([]);
                    let videobool = [];
                    let url = [];
                    for (let i = 0; i < statuses.length; i++) {
                        const status = statuses[i];
                        if (status.src.includes(".mp4")) {
                            videobool.push(true);
                        } else {
                            videobool.push(false);
                        }
                        url.push(status.src);
                    }
                    setFileUrl(url);
                    setIsVideo(videobool);
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (isModalOpen) {
            fetchStatus();
        }

    }, [isModalOpen, user]);

    return (
        <>
            {isModalOpen &&
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleClose}>
                    <div className="bg-white p-6 rounded-lg max-w-3xl max-h-3/4 overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <Swiper
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
                        >
                            {fileUrl.length > 0 &&
                                fileUrl.map((ind, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={ind} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>
            }
        </>
    )
}
