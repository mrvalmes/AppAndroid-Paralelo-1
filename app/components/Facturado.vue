<template>
<Page>
    <ActionBar title="Detalle de Facturas" />
    <ScrollView>
    <StackLayout class="p-20">
        <!-- DropDown para seleccionar el la factura -->
    <DropDown
        ref="dropDownList"
        :items="facturaNames"
        v-model="selectedIndex"
        hint="Seleccione una factura"
        class="dropdown-style"
        @selectedIndexChanged="dropDownSelectedIndexChanged"
        />
        
        <Button
        text="Mostrar Detalles"
        class="btn-mostrar"
        @tap="showDetails"
        />

        <!-- Mostrar detalles del smartphone seleccionado -->
        <StackLayout v-if="selectedFactura" class="details-container">
        <Label text="Información de la Factura" class="h3 mb-10" />

        <Label class="icon-label" text="Fecha:" />
        <Label :text="selectedFactura.created_at" class="detail-text mb-5" />

        <Label class="icon-label" text="Cliente:" />
        <Label :text="selectedFactura.cliente" class="detail-text mb-5" />

        <Label class="icon-label" text="Modelo del equipo:" />
        <Label :text="selectedSmartphone.Model" class="detail-text mb-5" />

        <Label class="icon-label" text="⚡ Cantidad:" />
        <Label :text="selectedFactura.cantidad" class="detail-text mb-5" />

        <Label class="icon-label" text="💲 Precio total:" />
        <Label :text="'$' + selectedFactura.monto_total" class="detail-text mb-5" />

        <Label class="icon-label" text="Equipo:" />
        <Image
        v-if="selectedSmartphone.Img"
        :src="selectedSmartphone.Img"
        class="phone-img"
        />
        </StackLayout>

        <!-- Botón Regresar -->
        <Button
        text="Regresar"
        class="btn-back"
        @tap="goBack"
        />
    </StackLayout>
    </ScrollView>
</Page>
</template>

<script>
export default {
    data() {
        return {
            facturas: [],
            selectedIndex: 0, // Índice seleccionado en el DropDown
            showDetailsSection: false, // Variable para controlar la visibilidad de los detalles
            selectedSmartphone: null // Objeto del smartphone relacionado con la factura
        };
    },
    computed: {
        // Arreglo de strings para mostrar en el DropDown
        facturaNames() {
            return this.facturas.map(f => `Factura #${f.id} - ${f.cliente}`); // Mostrar ID y cliente
        },
        // Obtener la factura seleccionada
        selectedFactura() {
            // Utiliza selectedIndex para acceder al elemento correcto en facturas
            return this.facturas[this.selectedIndex] || null;
        },
        // Obtener el smartphone relacionado con la factura
        selectedSmartphone() {
            if (this.selectedFactura && this.selectedFactura.smartphone_id) {
                const smartphone = this.smartphones.find(s => s.id === this.selectedFactura.smartphone_id);
                return smartphone || null;
            }
            return null;
        }
    },
    mounted() {
        // Cargar la lista al montar la vista
        this.cargarFacturas();
        this.cargarSmartphones(); // Carga los smartphones también
    },
    methods: {
        async cargarFacturas() {
            try {
                const response = await fetch('https://push-excellence-ko-land.trycloudflare.com/api/facturas');
                const data = await response.json();
                // Actualiza la lista de facturas con los datos del servidor
                this.facturas = data;
            } catch (err) {
                console.log(err);
                alert('No se pudo cargar la lista de Facturas');
            }
        },
        async cargarSmartphones() {
            try {
                const response = await fetch('https://push-excellence-ko- land.trycloudflare.com/api/smartphones');
                const data = await response.json();
                this.smartphones = data; // Almacena los smartphones en el estado
            } catch (err) {
                console.log(err);
                alert('No se pudo cargar la lista de Smartphones');
            }
        },
        // Función para manejar el evento @selectedIndexChanged
        dropDownSelectedIndexChanged() {
            // Actualiza selectedIndex con el valor actual
            this.selectedIndex = this.$refs.dropDownList.nativeView.selectedIndex;
            console.log("Índice actual:", this.selectedIndex); // Verifica el índice actual
        },
        async showDetails() {
            try {
                // Verifica si hay una factura seleccionada
                if (this.selectedFactura) {
                    this.showDetailsSection = true; // Muestra la sección de detalles
                } else {
                    alert('No se ha seleccionado una factura');
                }
            } catch (err) {
                console.log(err);
                alert('No se pudo cargar los detalles de la factura');
            }
        },
        goBack() {
            this.$navigateBack();
        }
    }
};
</script> 

<style scoped>
.dropdown-style {
margin-top: 20;
margin-bottom: 20;
background-color: #eaeaea;
font-size: 16;
color: #333;
border-radius: 4;
padding: 8;
}

.details-container {
background-color: #f2f2f2;
border-radius: 6;
padding: 16;
margin-bottom: 20;
}

.phone-img {
width: 200;
height: 200;
margin-top: 10;
margin-bottom: 10;
}

.btn-back {
background-color: #b44f4c;
color: white;
font-weight: bold;
margin-top: 20;
padding: 12 16;
border-radius: 6;
}

.btn-mostrar {
background-color: #0c30d1;
color: white;
font-weight: bold;
margin-top: 10;
padding: 8 10;
border-radius: 6;
}

.icon-label {
font-weight: bold;
margin-top: 8;
}
.detail-text {
margin-bottom: 10;
}
</style>
