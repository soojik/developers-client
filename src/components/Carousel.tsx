import { useEffect, useRef, useState } from "react";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import RightArrowIcon from "./icons/RightArrowIcon";
import BannerOne from "../images/Banner1.png";
import BannerTwo from "../images/Banner2.png";
import BannerThree from "../images/Banner3.png";

const Carousel = () => {
  const carouselImages = useRef([
    {
      src: BannerOne,
    },
    {
      src: BannerTwo,
    },
    {
      src: BannerThree,
    },
  ]);

  const [current, setCurrent] = useState(0);
  const [styled, setStyled] = useState({ translate: `-${current}00%` });
  const imgSize = useRef(carouselImages.current.length);

  const onSlide = (i: number) => {
    let nextIdx = current + i;
    if (nextIdx < 0) nextIdx = imgSize.current - 1;
    else if (nextIdx >= imgSize.current) nextIdx = 0;
    setCurrent(nextIdx);
  };

  useEffect(() => {
    setStyled({ translate: `-${current}00%` });
  }, [current]);

  return (
    <>
      <div
        id="indicators-carousel"
        className="relative w-full mb-10"
        data-carousel="static"
      >
        {/* Slide */}
        <div className="flex items-center justify-center ">
          <div className="w-full overflow-hidden rounded-lg h-80 bg-slate-500">
            <div className="flex transition-all" style={styled}>
              {carouselImages.current.map((img, i) => (
                <img
                  key={i}
                  className="flex-none object-cover w-full h-80"
                  src={img.src}
                  alt="캐러셀이미지"
                ></img>
              ))}
            </div>
          </div>
        </div>
        {/* Slider indicators */}
        <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2 ">
          {carouselImages.current.map((el, i) => (
            <button
              type="button"
              key={i}
              className={`w-3 h-3 rounded-full transition ease-in-out delay-100 ${
                i === current
                  ? " w-2.5 h-2.5 bg-gray-400"
                  : "bg-gray-200  w-2.5 h-2.5"
              }`}
              aria-current="true"
              aria-label="Slide indicators"
              data-carousel-slide-to="0"
            ></button>
          ))}
        </div>

        {/* Slider Btn */}
        <button
          type="button"
          className="absolute flex items-center justify-center w-10 sm:w-3 p-3 px-4 transition ease-in-out delay-50 rounded-3xl sm:rounded-lg left-3 sm:top-9 sm:h-4/5 top-[150px] bg-white/50 hover:bg-white/30"
          onClick={() => onSlide(-1)}
          data-carousel-prev
        >
          <LeftArrowIcon />
        </button>

        <button
          type="button"
          className="absolute flex items-center justify-center w-10 sm:w-3 p-3 px-4 transition ease-in-out delay-50 rounded-3xl sm:rounded-lg sm:top-9 sm:h-4/5 right-3 top-[150px] bg-white/50 hover:bg-white/30"
          onClick={() => onSlide(1)}
          data-carousel-next
        >
          <RightArrowIcon />
        </button>
      </div>
    </>
  );
};

export default Carousel;
