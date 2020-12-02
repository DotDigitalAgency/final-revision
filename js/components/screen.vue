<template>
    <section>
        <h1>{{title}}</h1>
        <img src="" alt="">
        <p>
            <slot />
        </p>
        <!-- <li v-for="item in actions" :key="item.message">
            <pixelButton>{{item.message}}</pixelButton>
        </li> -->
        <pixelButton>Hello</pixelButton>
    </section>
</template>

<script>
    import pixelButton from "./pixel_button.vue";

    export default {
        components: { pixelButton },
        props: ["title","image","actions"],
        mounted() {
            this.getData();
        }
    }
</script>

<style lang="scss" scoped>

</style>