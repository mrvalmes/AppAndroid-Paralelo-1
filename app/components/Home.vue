<template>
    <Page class="page">
        <ActionBar title="VamSmartphone ©2025" />
        <StackLayout class="p-20">
            <Label text="¿Que quieres hacer?" class="h2" />

            <!-- Botones de navegación -->
            <Button text="Consultar Equipos" @tap="goSmartphones" class="btn btn-primary mt-10" />
            <Button text="Crear Factura" @tap="goFactura" class="btn btn-primary mt-10" />
            <!--<Button text="Consultar Facturas" @tap="goFacturado" class="btn btn-primary mt-10" />-->
            
        </StackLayout>
    </Page>
</template>

<script>
export default {
    methods: {
        goSmartphones() {            
            this.$navigateTo(require('./SmartphonesList.vue').default);
        },
        goFactura() {
            this.$navigateTo(require('./Factura.vue').default);
        },
        goFacturado() {
            this.$navigateTo(require('./Facturado.vue').default);            
        }
    }
};
</script>

<style scoped>
.page {
    background-color: #FFF;
}
</style>
