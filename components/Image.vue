<template>
    <div
        class="image"
        :class="{ loaded, cover, contains }"
        :style="{
            '--focalPointX': `${(focalPoint.x || 0.5) * 100}%`,
            '--focalPointY': `${(focalPoint.y || 0.5) * 100}%`,
        }"
        v-if="image"
    >
        <nuxt-img
            sizes="xl:100vw"
            densities="1x"
            :width="width || image.width"
            :height="
                width
                    ? Math.round((width / image.width) * image.height)
                    : image.height
            "
            :src="image.filename + '/m/'"
            :alt="image.alt"
            :loading="loading"
            :preload="preload"
            @load="onLoad"
        />
    </div>
</template>

<script setup>
const { image, sizes, preload, loading, contains, cover, width } = defineProps({
    image: { type: Object, required: true },
    preload: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: String,
        default: "lazy",
    },
    contains: {
        type: Boolean,
        default: false,
    },
    cover: {
        type: Boolean,
        default: false,
    },
    width: {
        type: Number,
        default: 0,
    },
});

const loaded = ref(false);
const focalPoint = ref({});

if (image.focus) {
    const dimensions = {
        width: parseInt(image.filename.split("/")[5].split("x")[0]),
        height: parseInt(image.filename.split("/")[5].split("x")[1]),
    };
    focalPoint.value = {
        x: parseInt(image.focus.split(":")[0].split("x")[0]) / dimensions.width,
        y:
            parseInt(image.focus.split(":")[0].split("x")[1]) /
            dimensions.height,
    };
}

const onLoad = () => {
    loaded.value = true;
};
</script>

<style lang="scss" scoped>
.image {
    --focalPointX: 50%;
    --focalPointY: 50%;
    > img {
        display: block;
        width: 100%;
    }
    &.cover {
        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: var(--focalPointX) var(--focalPointY);
        }
    }
    &.contains {
        > img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}
</style>
