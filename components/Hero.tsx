"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides } from "@/data/hero";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Hero() {
  const { language } = useLanguage();
  const isNp = language === "np";
  const npClass = isNp ? "font-np" : "";
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % heroSlides.length);
    }, 5800);
    return () => clearInterval(id);
  }, []);

  const next = () => setActive((i) => (i + 1) % heroSlides.length);
  const prev = () =>
    setActive((i) => (i + heroSlides.length - 1) % heroSlides.length);

  return (
    <div
      id="home"
      className="relative h-[440px] overflow-hidden bg-[#0b1320] sm:h-[480px] lg:h-[530px]"
    >
      {heroSlides.map((slide, i) => (
        <div
          key={slide.label}
          className="absolute inset-0 transition-opacity duration-900 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <Image
            src={slide.imgSrc}
            alt={slide.label}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute left-[22px] top-[18px] hidden font-mono text-[11px] tracking-wide text-white/50 sm:block">
            [ {slide.label} ]
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(8,12,22,.85)_0%,rgba(8,12,22,.6)_42%,rgba(8,12,22,.12)_100%)]" />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-full flex-col justify-center px-5 sm:max-w-[min(720px,56%)] sm:px-[60px]">
            <div className="font-np inline-flex self-start items-center gap-2 rounded-[3px] bg-[#D24B45] px-[13px] py-1.5 text-[10.5px] font-bold tracking-[1px] text-white sm:text-[11.5px] sm:tracking-[1.5px]">
              {slide.en}
            </div>
            <div className={`mt-[14px] whitespace-pre-line text-[28px] font-extrabold leading-[1.18] text-white [text-shadow:0_2px_18px_rgba(0,0,0,.4)] sm:mt-[18px] sm:text-[36px] lg:text-[48px] ${npClass}`}>
              {isNp ? slide.title : slide.titleEn}
            </div>
            <div className="mt-3 max-w-[540px] text-[14px] leading-[1.55] text-white/88 sm:mt-4 sm:text-[16px]">
              {slide.sub}
            </div>
            <div className="mt-5 flex flex-wrap gap-3 sm:mt-7 sm:gap-3.5">
              <a
                href="#services"
                className={`rounded bg-[#D24B45] px-5 py-3 text-[13.5px] font-bold text-white sm:px-[26px] sm:py-[13px] sm:text-[14.5px] ${npClass}`}
              >
                {isNp ? "हाम्रा सेवाहरू" : "Our Services"}
              </a>
              <a
                href="#doctors"
                className={`rounded border border-white/50 bg-white/[.12] px-5 py-3 text-[13.5px] font-semibold text-white sm:px-[26px] sm:py-[13px] sm:text-[14.5px] ${npClass}`}
              >
                {isNp ? "चिकित्सक खोज्नुहोस्" : "Find a Doctor"}
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute bottom-[70px] left-[14px] flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-[#080c16]/40 text-[16px] text-white sm:bottom-[90px] sm:left-[22px] sm:h-11 sm:w-11 sm:text-[18px]"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute bottom-[70px] left-[58px] flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-[#080c16]/40 text-[16px] text-white sm:bottom-[90px] sm:left-[74px] sm:h-11 sm:w-11 sm:text-[18px]"
      >
        ›
      </button>

      <div className="absolute bottom-[24px] right-[18px] flex items-center gap-2 sm:bottom-[100px] sm:right-[34px]">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.label}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-[9px] rounded-[5px] border-none p-0 transition-all duration-400 ease-in-out"
            style={{
              width: i === active ? "30px" : "10px",
              background: i === active ? "#fff" : "rgba(255,255,255,.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
