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
        <div class="footer">
            <Image :image="story.content.logo" />
            <div class="infos">
                <div
                    v-for="info in story.content.infos"
                    :key="info.id"
                    class="info"
                >
                    <div v-html="renderRichText(info.Text)"></div>
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

const activeSlide = ref(0);
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
    launchAutoplay();
});

// useSeo(data.value?.home?._seoMetaTags);
</script>

<style lang="scss" scoped>
.page {
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
}

.wrapper-slider {
    flex: 1 1 0%;
    width: 100%;
}
.slider {
    position: relative;
    width: 100%;
    height: 100%;
}

.footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 20px;
    background-color: $white;
    .image {
        height: 50px;
        margin-bottom: 20px;
        &:deep(img) {
            height: 100%;
            width: auto;
        }
    }
}

.infos {
    display: flex;
    &:deep(p) {
        margin-top: 0;
    }
}

.info {
    padding: 0 20px;
    font-size: 1.2rem;
    border-left: 1px solid $black;
    &:first-child {
        border-left: 0px;
    }
    &:deep(a) {
        text-decoration: underline;
    }
}

.bullets {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    z-index: 2;
    &::before {
        content: "";
        position: absolute;
        top: -100px;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0) 100%
        );

        z-index: -1;
    }
}

.bullet {
    padding: 5px;
    border: none;
    &.active .inner-bullet {
        width: 25px;
        &::before {
            display: block;
        }
    }
}
.inner-bullet {
    position: relative;
    height: 10px;
    width: 10px;
    border-radius: 5px;
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
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: $white;
    border: none;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 50px 0px rgba(49, 49, 49, 0.5);
    &::after {
        content: "";
        display: block;
        width: 9px;
        height: 14px;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 9 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.10367 13.3105L0.689453 11.8963L5.48235 7.10344L0.689453 2.31055L2.10367 0.896334L8.31077 7.10344L2.10367 13.3105Z' fill='black'/%3E%3C/svg%3E%0A");
    }
    &.prev {
        left: 20px;
        transform: translateY(-50%) rotate(-180deg);
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
        margin-left: 20px;
    }
    .info {
        &:first-child {
            border-left: 1px solid $black;
        }
    }
}

@media (min-width: $tablet) {
    .footer {
        padding: 30px;
    }
    .info {
        font-size: 1.6rem;
    }
}
</style>
