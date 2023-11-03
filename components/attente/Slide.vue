<template>
    <div class="slide">
        <div
            class="text"
            v-html="titre"
            :style="{ '--color': textColor }"
        ></div>
        <Image
            :loading="index === 0 ? 'eager' : 'lazy'"
            cover
            :image="data.Image"
        />
    </div>
</template>

<script setup>
const { data, activeSlide, index } = defineProps({
    data: { type: Object, required: true },
    activeSlide: { type: Number, required: true },
    index: { type: Number, required: true },
});

const titre = computed(() => renderRichText(data.Titre));
const textColor = computed(() => data.couleur_texte?.color || "#fff");
</script>

<style lang="scss" scoped>
.slide {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    flex: 0 0 100%;
    opacity: 0;
    transition: opacity 0s ease-out 0.8s;
    z-index: 0;
    &.active {
        opacity: 1;
        transition: opacity 0.8s ease-out;
        z-index: 1;
        .image {
            transform: scale(1);
        }
    }
}

.text {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0;
    padding: 20px;
    z-index: 2;
    font-size: 1.4rem;
    color: var(--color);
}

.image {
    width: 100%;
    height: 100%;
    transform: scale(1.2);
    transition: transform 8s linear;
}

@media (min-width: $tablet) {
    .text {
        font-size: 1.6rem;
        padding: 30px;
    }
}

@media (min-width: $desktop) {
    .text {
        padding: 30px 50px;
    }
}
</style>
