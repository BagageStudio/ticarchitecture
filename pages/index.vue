<template>
    <div class="page">
        <div class="wrapper-slider">
            <div class="slider">
                <AttenteSlide
                    v-for="(slide, index) in story.content.slider"
                    :key="slide._uid"
                    :data="slide"
                    :activeSlide="activeSlide"
                    :index="index"
                    :class="{ active: activeSlide === index }"
                />
                <button
                    class="arrow-btn prev"
                    role="button"
                    @click="prevSlide"
                ></button>
                <button
                    class="arrow-btn next"
                    role="button"
                    @click="nextSlide"
                ></button>
            </div>
        </div>
        <div class="wrapper-footer">
            <div class="bullets" :style="{ '--progress': progress }">
                <button
                    class="bullet"
                    v-for="(slide, index) in story.content.slider"
                    :key="slide._uid"
                    :class="{ active: activeSlide === index }"
                    role="button"
                    @click="setSlide(index)"
                >
                    <div class="inner-bullet"></div>
                </button>
            </div>
            <div class="footer">
                <div class="infos">
                    <Image :image="story.content.logo" contains />
                    <div
                        v-for="info in story.content.infos"
                        :key="info.id"
                        class="info"
                    >
                        <div
                            class="info-inner"
                            v-html="renderRichText(info.Text)"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { gsap } from "gsap";

const story = await useAsyncStoryblok("attente");

if (story.value.status) {
    throw createError({
        statusCode: story.value.status,
        statusMessage: story.value.response,
    });
}

const activeSlide = ref(-1);
const timer = ref(null);
const progress = ref(0);

const setSlide = (index) => {
    activeSlide.value = index;
    launchAutoplay();
};

const nextSlide = () => {
    const nextIndex =
        activeSlide.value + 1 > story.value.content.slider.length - 1
            ? 0
            : activeSlide.value + 1;
    setSlide(nextIndex);
};

const prevSlide = () => {
    const prevIndex =
        activeSlide.value === 0
            ? story.value.content.slider.length - 1
            : activeSlide.value - 1;
    setSlide(prevIndex);
};

const launchAutoplay = () => {
    if (timer.value) timer.value.kill();
    progress.value = 0;
    timer.value = gsap.to(progress, {
        value: 1,
        duration: 8,
        ease: "linear",
        onComplete: () => nextSlide(),
    });
};

onMounted(() => {
    activeSlide.value = 0;
    launchAutoplay();
});

useHead({
    htmlAttrs: {
        lang: "fr",
    },
    title: "TICA architectes & urbanistes",
});
</script>

<style lang="scss" scoped>
.page {
    position: relative;
    height: 100dvh;
    width: 100vw;
    overflow: hidden;
}

.wrapper-slider {
    height: 100%;
    width: 100%;
}
.slider {
    position: relative;
    width: 100%;
    height: 100%;
}

.wrapper-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
}

.footer {
    flex-shrink: 0;
    padding: 20px;
    .image {
        display: flex;
        height: 30px;
        width: 48%;
        margin-bottom: 20px;
        &:deep(img) {
            height: 100%;
            width: auto;
        }
    }
}

.infos {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    &:deep(p) {
        margin-top: 0;
    }
}

.info {
    display: flex;
    justify-content: flex-start;
    width: 48%;
    font-size: 1.2rem;
    line-height: 15px;
    font-weight: normal;
    &:first-child {
        border-left: 0px;
    }
}

.info-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.bullets {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    z-index: 2;
}

.bullet {
    padding: 5px;
    border: none;
    &.active .inner-bullet {
        width: 17px;
        &::before {
            display: block;
        }
    }
    &:not(.active) .inner-bullet {
        &:hover,
        &:focus {
            background-color: $white;
        }
    }
}
.inner-bullet {
    position: relative;
    height: 3px;
    width: 7px;
    overflow: hidden;
    background-color: rgb(255 255 255 / 40%);
    transition: width 0.2s ease-out;
    &::before {
        content: "";
        display: none;
        width: 100%;
        height: 100%;
        transform: scaleX(var(--progress));
        transform-origin: 0 0;
        background-color: $white;
    }
}

.arrow-btn {
    position: absolute;
    width: 45px;
    height: 45px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: none;
    top: 50%;
    transform: translateY(-50%);
    transform-origin: 50% 50%;
    z-index: 2;
    &::after,
    &::before {
        content: "";
        position: relative;
        display: block;
        height: 2px;
        width: 20px;
        background-color: $white;
    }
    &::before {
        transform-origin: 100% 50%;
        top: 1.5px;
        transform: rotate(45deg);
    }
    &::after {
        transform-origin: 100% 50%;
        top: -1.5px;
        transform: rotate(-45deg);
    }
    &.prev {
        transform: translateY(-50%) rotate(-180deg);
        left: 20px;
    }
    &.next {
        right: 20px;
    }
}

@media (min-width: $phone) {
    .footer {
        flex-direction: row;
        .image {
            margin-bottom: 0;
        }
    }
    .infos {
        flex-wrap: nowrap;
    }
    .info {
        width: auto;
    }
    .info-inner {
        align-items: flex-end;
    }
    .footer .image {
        width: auto;
    }
}

@media (min-width: $tablet) {
    .footer {
        padding: 30px;
    }
    .info {
        font-size: 1.6rem;
        line-height: 18px;
    }
    .footer .image {
        height: 36px;
    }

    .bullet {
        &.active .inner-bullet {
            width: 45px;
        }
    }
    .inner-bullet {
        width: 20px;
    }
}

@media (min-width: $desktop) {
    .footer {
        padding: 30px 50px;
    }
    .info {
        font-size: 2.2rem;
        line-height: 25px;
    }
    .footer .image {
        height: 50px;
    }
}
</style>
