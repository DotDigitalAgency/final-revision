<template>
    <a href=#>
        <slot />
    </a>
</template>

<script>
    export default {

    }
</script>

<style lang="scss" scoped>
    a {
        display: block;
        padding: 10px;
        margin: 5px;
        border: 1px solid black;
        text-align: center;
        color: black;
        text-decoration: none;
    }
</style>